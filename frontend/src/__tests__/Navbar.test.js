import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';

// Mock react-router-dom - this should use the mock we created
jest.mock('react-router-dom');

// Import the mocked useLocation to manipulate it
import { useLocation } from 'react-router-dom';

describe('Navbar Component', () => {
  test('renders navbar links when not on dashboard page', () => {
    // Mock location to be any page other than dashboard
    useLocation.mockReturnValue({ pathname: '/workouts' });
    
    render(<Navbar />);
    
    // Check if navbar links are rendered
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Workout Tracker')).toBeInTheDocument();
    expect(screen.getByText('Nutrition Tracker')).toBeInTheDocument();
    expect(screen.getByText('Weight Tracker')).toBeInTheDocument();
    expect(screen.getByText('Calorie Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Training Programs')).toBeInTheDocument();
    expect(screen.getByText('Fitness Bot')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
  
  test('does not render navbar on dashboard page', () => {
    // Mock location to be dashboard
    useLocation.mockReturnValue({ pathname: '/' });
    
    const { container } = render(<Navbar />);
    
    // Check if navbar is not rendered
    expect(container.firstChild).toBeNull();
  });
});