import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';

// Mock react-router-dom - this should use the mock we created
jest.mock('react-router-dom');

// Mock fetch API
global.fetch = jest.fn();

// Mock localStorage
beforeEach(() => {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  };
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  });
});

describe('Login Component', () => {
  const mockOnLogin = jest.fn();
  
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
    mockOnLogin.mockClear();
  });
  
  test('renders login form by default', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    // Check login form elements
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account? Register here")).toBeInTheDocument();
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
  });
  
  test('switches to registration form', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    // Click on register link
    fireEvent.click(screen.getByText("Don't have an account? Register here"));
    
    // Check if registration form fields appear
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Age')).toBeInTheDocument();
    expect(screen.getByText('Select Gender')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Height (cm)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Weight (kg)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByText('Already have an account? Login')).toBeInTheDocument();
  });
  
  test('handles successful login', async () => {
    const mockUserData = { id: '123', username: 'testuser' };
    
    // Mock fetch responses for login and user data
    fetch.mockImplementation((url) => {
      if (url === 'http://127.0.0.1:8000/login') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ access_token: 'fake-token' }),
        });
      } else if (url === 'http://127.0.0.1:8000/me') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUserData),
        });
      }
      return Promise.reject(new Error('Unexpected URL'));
    });
    
    render(<Login onLogin={mockOnLogin} />);
    
    // Fill in login form
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    
    // Wait for login process to complete
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalled();
      expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('user_id', '123');
    });
  });
  
  test('handles forgot password flow', () => {
    render(<Login onLogin={mockOnLogin} />);
    
    // Click on forgot password link
    fireEvent.click(screen.getByText('Forgot Password?'));
    
    // Check if password reset request form appears
    expect(screen.getByRole('button', { name: 'Request Password Reset' })).toBeInTheDocument();
    expect(screen.getByText('Back to Login')).toBeInTheDocument();
  });
});