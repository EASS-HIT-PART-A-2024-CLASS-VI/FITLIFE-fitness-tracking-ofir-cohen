import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

describe('Dashboard Component', () => {
  test('renders dashboard content', () => {
    render(<Dashboard />);
    
    // Check if main elements are in the document
    expect(screen.getByText('Welcome to FitLife')).toBeInTheDocument();
    expect(screen.getByText('Track your workouts, nutrition, and progress all in one place.')).toBeInTheDocument();
    
    // Verify the component renders with the expected class
    const dashboardElement = screen.getByText('Welcome to FitLife').closest('div');
    expect(dashboardElement).toHaveClass('dashboard-content');
  });
});