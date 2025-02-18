import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import NutritionTracker from '../components/NutritionTracker';

// Mock chart.js components
jest.mock('react-chartjs-2', () => ({
  Pie: () => <div data-testid="mocked-pie-chart" />
}));

// Mock window.alert
window.alert = jest.fn();

describe('NutritionTracker Component', () => {
  // Clean up after each test to avoid multiple instances
  afterEach(() => {
    cleanup();
    window.alert.mockClear();
  });
  
  beforeEach(() => {
    // Setup localStorage mock for each test
    const mockData = {};
    const localStorageMock = {
      getItem: jest.fn(key => {
        if (key === 'foodLogs') return JSON.stringify(mockData);
        if (key === 'calorieGoal') return '2000';
        return null;
      }),
      setItem: jest.fn((key, value) => {
        mockData[key] = value;
      }),
      clear: jest.fn()
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
  });

  test('renders initial state correctly', () => {
    render(<NutritionTracker />);
    
    // Check heading
    expect(screen.getByText('Nutrition Tracker')).toBeInTheDocument();
    
    // Check form inputs
    expect(screen.getByPlaceholderText('Food')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Calories')).toBeInTheDocument();
    expect(screen.getByText('Select Meal Type')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add food Log' })).toBeInTheDocument();
    
    // Check date navigation
    const today = new Date().toISOString().split('T')[0];
    expect(screen.getByText(today)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '← Previous Day' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next Day →' })).toBeInTheDocument();
    
    // Check calorie goal input (defaults to 2000)
    const goalInput = screen.getByDisplayValue('2000');
    expect(goalInput).toBeInTheDocument();
    
    // Check empty state message
    expect(screen.getByText('No food logs for this day.')).toBeInTheDocument();
    
    // Calorie summary should show 0/2000
    expect(screen.getByText('Total Calories: 0 / 2000')).toBeInTheDocument();
  });
  
  test('shows alert when adding incomplete food log', () => {
    render(<NutritionTracker />);
    
    // Click add without filling the form
    fireEvent.click(screen.getByRole('button', { name: 'Add food Log' }));
    
    // Alert should be shown
    expect(window.alert).toHaveBeenCalledWith('Please enter all details.');
    
    // No logs should be added, empty state should remain
    expect(screen.getByText('No food logs for this day.')).toBeInTheDocument();
  });
  
  test('adds a food log entry', () => {
    // Setup mock data
    const today = new Date().toISOString().split('T')[0];
    const updatedLogs = {
      [today]: [{ food: 'Chicken Breast', calories: 250, mealType: 'Lunch' }]
    };
    
    // Create a component with mocked localStorage that can be updated
    const mockGetItem = jest.fn(key => {
      if (key === 'foodLogs') return JSON.stringify({});
      if (key === 'calorieGoal') return '2000';
      return null;
    });
    
    const mockSetItem = jest.fn((key, value) => {
      if (key === 'foodLogs') {
        // Update the mock to return the new data
        mockGetItem.mockImplementation(k => {
          if (k === 'foodLogs') return JSON.stringify(updatedLogs);
          if (k === 'calorieGoal') return '2000';
          return null;
        });
      }
    });
    
    window.localStorage.getItem = mockGetItem;
    window.localStorage.setItem = mockSetItem;
    
    // Render the component
    const { rerender } = render(<NutritionTracker />);
    
    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Food'), { target: { value: 'Chicken Breast' } });
    fireEvent.change(screen.getByPlaceholderText('Calories'), { target: { value: '250' } });
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Lunch' } });
    
    // Add the food log
    fireEvent.click(screen.getByRole('button', { name: 'Add food Log' }));
    
    // Verify localStorage was updated
    expect(mockSetItem).toHaveBeenCalled();
    
    // Rerender to reflect the changes
    rerender(<NutritionTracker />);
    
    // Calorie summary should be updated
    expect(screen.getByText('Total Calories: 250 / 2000')).toBeInTheDocument();
    
    // Chart container should be visible and no error message
    expect(screen.queryByText('No food logs for this day.')).not.toBeInTheDocument();
    expect(screen.getByTestId('mocked-pie-chart')).toBeInTheDocument();
  });
  
  test('updates calorie goal', () => {
    render(<NutritionTracker />);
    
    // Change calorie goal
    const goalInput = screen.getByDisplayValue('2000');
    fireEvent.change(goalInput, { target: { value: '2500' } });
    
    // Calorie summary should update
    expect(screen.getByText('Total Calories: 0 / 2500')).toBeInTheDocument();
    
    // Check localStorage update
    expect(window.localStorage.setItem).toHaveBeenCalledWith('calorieGoal', '2500');
  });
  
  test('navigates between days', () => {
    // Set up mock localStorage data for different days
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const mockFoodLogs = {
      [todayStr]: [
        { food: 'Banana', calories: 105, mealType: 'Breakfast' }
      ],
      [yesterdayStr]: [
        { food: 'Salad', calories: 150, mealType: 'Lunch' },
        { food: 'Steak', calories: 350, mealType: 'Dinner' }
      ]
    };
    
    // Update localStorage mock 
    window.localStorage.getItem.mockImplementation(key => {
      if (key === 'foodLogs') return JSON.stringify(mockFoodLogs);
      if (key === 'calorieGoal') return '2000';
      return null;
    });
    
    render(<NutritionTracker />);
    
    // Today should show one food item and correct calories
    expect(screen.getByTestId('mocked-pie-chart')).toBeInTheDocument();
    expect(screen.getByText('Total Calories: 105 / 2000')).toBeInTheDocument();
    
    // Navigate to yesterday
    fireEvent.click(screen.getByRole('button', { name: '← Previous Day' }));
    
    // Date should change
    expect(screen.getByText(yesterdayStr)).toBeInTheDocument();
    
    // Yesterday should show total calories from two items
    expect(screen.getByText('Total Calories: 500 / 2000')).toBeInTheDocument();
  });
  
  test('prevents navigation to future dates', () => {
    render(<NutritionTracker />);
    
    const today = new Date().toISOString().split('T')[0];
    
    // Try to navigate to future
    fireEvent.click(screen.getByRole('button', { name: 'Next Day →' }));
    
    // Date should still be today
    expect(screen.getByText(today)).toBeInTheDocument();
  });
});