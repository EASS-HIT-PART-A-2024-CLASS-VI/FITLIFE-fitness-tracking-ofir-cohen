import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WorkoutTracker from '../components/WorkoutTracker';

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key]),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: function() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('WorkoutTracker Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    localStorage.getItem.mockImplementation(key => {
      if (key === 'userId') return '1';
      return null;
    });
  });
  
  test('renders initial state correctly', () => {
    render(<WorkoutTracker />);
    
    // Check heading
    expect(screen.getByText('Workout Tracker')).toBeInTheDocument();
    
    // Check form elements
    expect(screen.getByPlaceholderText('Exercise')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Duration (minutes)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Workout' })).toBeInTheDocument();
    
    // Check date navigation
    const today = new Date().toISOString().split('T')[0];
    expect(screen.getByText(today)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '← Previous Day' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next Day →' })).toBeInTheDocument();
    
    // Check initial empty state
    expect(screen.getByText('No workouts recorded yet for this date.')).toBeInTheDocument();
  });
  
  test('adds a workout', () => {
    render(<WorkoutTracker />);
    
    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Exercise'), { target: { value: 'Running' } });
    fireEvent.change(screen.getByPlaceholderText('Duration (minutes)'), { target: { value: '30' } });
    
    // Add the workout
    fireEvent.click(screen.getByRole('button', { name: 'Add Workout' }));
    
    // Workout should be visible in the list
    expect(screen.getByText('Running: 30 minutes')).toBeInTheDocument();
    expect(screen.queryByText('No workouts recorded yet for this date.')).not.toBeInTheDocument();
    
    // Check if localStorage was updated
    const today = new Date().toISOString().split('T')[0];
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'workouts_1',
      expect.stringContaining(today)
    );
  });
  
  test('deletes a workout', () => {
    // Set up mock data in localStorage
    const today = new Date().toISOString().split('T')[0];
    const mockWorkouts = {
      [today]: [
        { id: 123, exercise: 'Running', duration: 30 },
        { id: 456, exercise: 'Yoga', duration: 45 }
      ]
    };
    
    localStorage.getItem.mockImplementation(key => {
      if (key === 'userId') return '1';
      if (key === 'workouts_1') return JSON.stringify(mockWorkouts);
      return null;
    });
    
    render(<WorkoutTracker />);
    
    // Both workouts should be visible
    expect(screen.getByText('Running: 30 minutes')).toBeInTheDocument();
    expect(screen.getByText('Yoga: 45 minutes')).toBeInTheDocument();
    
    // Delete the first workout
    const deleteButtons = screen.getAllByRole('button', { name: 'X' });
    fireEvent.click(deleteButtons[0]);
    
    // First workout should be gone, second should remain
    expect(screen.queryByText('Running: 30 minutes')).not.toBeInTheDocument();
    expect(screen.getByText('Yoga: 45 minutes')).toBeInTheDocument();
    
    // Check if localStorage was updated with the remaining workout
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'workouts_1',
      expect.stringContaining('Yoga')
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'workouts_1',
      expect.not.stringContaining('Running')
    );
  });
  
  test('navigates between days', () => {
    // Set up mock data for multiple days
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const mockWorkouts = {
      [todayStr]: [
        { id: 123, exercise: 'Running', duration: 30 }
      ],
      [yesterdayStr]: [
        { id: 456, exercise: 'Swimming', duration: 60 }
      ]
    };
    
    localStorage.getItem.mockImplementation(key => {
      if (key === 'userId') return '1';
      if (key === 'workouts_1') return JSON.stringify(mockWorkouts);
      return null;
    });
    
    render(<WorkoutTracker />);
    
    // Today's workout should be visible
    expect(screen.getByText('Running: 30 minutes')).toBeInTheDocument();
    
    // Navigate to yesterday
    fireEvent.click(screen.getByRole('button', { name: '← Previous Day' }));
    
    // Date should change
    expect(screen.getByText(yesterdayStr)).toBeInTheDocument();
    
    // Yesterday's workout should be visible
    expect(screen.queryByText('Running: 30 minutes')).not.toBeInTheDocument();
    expect(screen.getByText('Swimming: 60 minutes')).toBeInTheDocument();
  });
  
  test('prevents navigation to future dates', () => {
    render(<WorkoutTracker />);
    
    const today = new Date().toISOString().split('T')[0];
    
    // Try to navigate to future
    fireEvent.click(screen.getByRole('button', { name: 'Next Day →' }));
    
    // Date should still be today
    expect(screen.getByText(today)).toBeInTheDocument();
  });
  
  test('shows validation warning for incomplete form', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<WorkoutTracker />);
    
    // Try to add workout without filling form
    fireEvent.click(screen.getByRole('button', { name: 'Add Workout' }));
    
    // Alert should be shown
    expect(alertMock).toHaveBeenCalledWith('Please enter both exercise and duration');
    
    // No workout should be added
    expect(screen.getByText('No workouts recorded yet for this date.')).toBeInTheDocument();
    
    alertMock.mockRestore();
  });
});