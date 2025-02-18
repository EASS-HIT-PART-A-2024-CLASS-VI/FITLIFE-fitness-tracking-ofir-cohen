import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FoodLogTable from '../components/FoodLogTable';

describe('FoodLogTable Component', () => {
  const mockFoodLogs = [
    { food: 'Apple', calories: 95, mealType: 'Snack' },
    { food: 'Chicken Breast', calories: 165, mealType: 'Lunch' },
  ];
  
  const mockDelete = jest.fn();
  
  test('renders table with food logs', () => {
    render(<FoodLogTable foodLogs={mockFoodLogs} onDelete={mockDelete} />);
    
    // Check heading
    expect(screen.getByText('Food Log')).toBeInTheDocument();
    
    // Check table headers
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Calories')).toBeInTheDocument();
    expect(screen.getByText('Meal Type')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    
    // Check food log entries
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('95')).toBeInTheDocument();
    expect(screen.getByText('Snack')).toBeInTheDocument();
    expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
    expect(screen.getByText('165')).toBeInTheDocument();
    expect(screen.getByText('Lunch')).toBeInTheDocument();
  });
  
  test('calls delete function when delete button is clicked', () => {
    render(<FoodLogTable foodLogs={mockFoodLogs} onDelete={mockDelete} />);
    
    // Get delete buttons
    const deleteButtons = screen.getAllByText('Delete');
    
    // Click the first delete button
    fireEvent.click(deleteButtons[0]);
    
    // Verify delete function was called with correct index
    expect(mockDelete).toHaveBeenCalledWith(0);
  });
  
  test('renders empty table when no logs provided', () => {
    render(<FoodLogTable foodLogs={[]} onDelete={mockDelete} />);
    
    // Check heading is still there
    expect(screen.getByText('Food Log')).toBeInTheDocument();
    
    // Table headers should still be visible
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText('Calories')).toBeInTheDocument();
    expect(screen.getByText('Meal Type')).toBeInTheDocument();
    
    // No food entries should be visible
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
    expect(screen.queryByText('Chicken Breast')).not.toBeInTheDocument();
  });
});