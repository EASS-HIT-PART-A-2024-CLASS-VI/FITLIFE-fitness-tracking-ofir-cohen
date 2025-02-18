import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../components/Register';

// Mock fetch API
global.fetch = jest.fn();

// Mock logo
jest.mock('../assets/fitlife_logo.png', () => 'mocked-logo-path');

describe('Register Component', () => {
  const mockOnRegisterSuccess = jest.fn();
  
  beforeEach(() => {
    fetch.mockClear();
    mockOnRegisterSuccess.mockClear();
  });
  
  test('renders registration form', () => {
    render(<Register onRegisterSuccess={mockOnRegisterSuccess} />);
    
    // Check form elements
    expect(screen.getByText('Register to FitLife')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Age')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Gender')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Height (cm)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Weight (kg)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });
  
  test('handles form submission', async () => {
    // Mock successful registration
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });
    
    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<Register onRegisterSuccess={mockOnRegisterSuccess} />);
    
    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Age'), { target: { value: '25' } });
    fireEvent.change(screen.getByPlaceholderText('Gender'), { target: { value: 'Male' } });
    fireEvent.change(screen.getByPlaceholderText('Height (cm)'), { target: { value: '175' } });
    fireEvent.change(screen.getByPlaceholderText('Weight (kg)'), { target: { value: '70' } });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: 'Register' }).closest('form'));
    
    // Verify fetch was called with correct data
    expect(fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/register',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.any(String)
      })
    );
    
    // Check that the body contains the form data
    const requestBody = JSON.parse(fetch.mock.calls[0][1].body);
    expect(requestBody).toEqual({
      username: 'testuser',
      password: 'password123',
      name: 'Test User',
      age: '25',
      gender: 'Male',
      height: '175',
      weight: '70'
    });
    
    // Wait for success message and callback
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Registration successful! You can now log in.');
      expect(mockOnRegisterSuccess).toHaveBeenCalled();
    });
    
    alertMock.mockRestore();
  });
  
  test('handles registration failure', async () => {
    // Mock failed registration
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Username already exists' })
    });
    
    render(<Register onRegisterSuccess={mockOnRegisterSuccess} />);
    
    // Fill out minimal required fields
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Age'), { target: { value: '25' } });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: 'Register' }).closest('form'));
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Registration failed. Try again.')).toBeInTheDocument();
    });
    
    // Success callback should not be called
    expect(mockOnRegisterSuccess).not.toHaveBeenCalled();
  });
});