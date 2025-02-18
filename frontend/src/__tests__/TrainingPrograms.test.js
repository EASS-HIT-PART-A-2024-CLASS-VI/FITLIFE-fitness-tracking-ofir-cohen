import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TrainingPrograms from '../components/TrainingPrograms';

// Mock axios - this will use the mock we created in __mocks__/axios.js
jest.mock('axios');
// Import the mocked axios
import axios from 'axios';

// Mock window.open
const mockOpen = jest.fn();
global.open = mockOpen;

// Mock window.alert
window.alert = jest.fn();

describe('TrainingPrograms Component', () => {
  beforeEach(() => {
    axios.get.mockClear();
    mockOpen.mockClear();
    window.alert.mockClear();
    
    // Add default mock to avoid TypeError
    axios.get.mockResolvedValue({
      data: { available_programs: [] }
    });
  });
  
  test('renders initial state and fetches programs', async () => {
    // Mock successful API response
    axios.get.mockResolvedValueOnce({
      data: {
        available_programs: ['weight_loss', 'muscle_gain', 'endurance']
      }
    });
    
    render(<TrainingPrograms />);
    
    // Check heading and description
    expect(screen.getByText('Training Programs')).toBeInTheDocument();
    expect(screen.getByText('Select your fitness goal and download a personalized training program.')).toBeInTheDocument();
    
    // Select and download buttons should be visible
    expect(screen.getByText('Select a program')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download Program' })).toBeInTheDocument();
    
    // Wait for API call to complete
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/training-programs');
    });
    
    // Wait for options to be populated
    await waitFor(() => {
      // Check that we have the expected options
      expect(screen.getAllByRole('option').length).toBe(4); // 3 programs + default option
      expect(screen.getByText('WEIGHT LOSS')).toBeInTheDocument();
      expect(screen.getByText('MUSCLE GAIN')).toBeInTheDocument();
      expect(screen.getByText('ENDURANCE')).toBeInTheDocument();
    });
  });
  
  test('prevents download when no program selected', async () => {
    render(<TrainingPrograms />);
    
    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Download Program' })).toBeInTheDocument();
    });
    
    // Try to download without selecting
    fireEvent.click(screen.getByRole('button', { name: 'Download Program' }));
    
    // Alert should be shown
    expect(window.alert).toHaveBeenCalledWith('Please select a training program.');
    
    // Window.open should not be called
    expect(mockOpen).not.toHaveBeenCalled();
  });
  
  test('downloads selected program', async () => {
    // Mock successful API response
    axios.get.mockResolvedValueOnce({
      data: {
        available_programs: ['weight_loss', 'muscle_gain']
      }
    });
    
    render(<TrainingPrograms />);
    
    // Wait for programs to load
    await waitFor(() => {
      expect(screen.getByText('WEIGHT LOSS')).toBeInTheDocument();
    });
    
    // Select a program
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'weight_loss' } });
    
    // Click download
    fireEvent.click(screen.getByRole('button', { name: 'Download Program' }));
    
    // Window.open should be called with correct URL
    expect(mockOpen).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/training-programs/weight_loss',
      '_blank'
    );
  });
  
  test('handles API error gracefully', async () => {
    // Mock failed API response
    axios.get.mockRejectedValueOnce(new Error('Network error'));
    
    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<TrainingPrograms />);
    
    // Wait for API call to fail
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/training-programs');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    
    // Dropdown should be empty (only default option)
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(1);
    expect(options[0].textContent).toBe('Select a program');
    
    consoleErrorSpy.mockRestore();
  });
});