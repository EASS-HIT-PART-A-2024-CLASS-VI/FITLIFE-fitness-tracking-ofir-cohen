import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CalorieRecommendations from '../components/CalorieRecommendations';

// Mock axios - this will use the mock we created in __mocks__/axios.js
jest.mock('axios');
// Import the mocked axios
import axios from 'axios';

describe('CalorieRecommendations Component', () => {
  beforeEach(() => {
    axios.get.mockClear();
  });
  
  test('renders form correctly', () => {
    render(<CalorieRecommendations />);
    
    // Check heading
    expect(screen.getByText('Calorie Recommendations')).toBeInTheDocument();
    
    // Check form elements using text content
    expect(screen.getByText('Age:')).toBeInTheDocument();
    expect(screen.getByText('Weight (kg):')).toBeInTheDocument();
    expect(screen.getByText('Height (cm):')).toBeInTheDocument();
    expect(screen.getByText('Gender:')).toBeInTheDocument();
    expect(screen.getByText('Activity Level:')).toBeInTheDocument();
    expect(screen.getByText('Fitness Goal:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Calculate' })).toBeInTheDocument();
    
    // Get all number inputs and verify they exist
    const spinbuttons = screen.getAllByRole('spinbutton');
    expect(spinbuttons).toHaveLength(3);
    
    // Get all dropdowns and verify they exist
    const dropdowns = screen.getAllByRole('combobox');
    expect(dropdowns).toHaveLength(3);
    
    // No results should be visible initially
    expect(screen.queryByText(/Recommended Calories:/)).not.toBeInTheDocument();
  });
  
  test('calculates and displays calories', async () => {
    // Mock successful API response
    axios.get.mockResolvedValueOnce({
      data: { recommended_calories: 2500 }
    });
    
    render(<CalorieRecommendations />);
    
    // Get all input fields by their roles and indices
    const spinbuttons = screen.getAllByRole('spinbutton');
    const dropdowns = screen.getAllByRole('combobox');
    
    // Fill out the form
    fireEvent.change(spinbuttons[0], { target: { value: '30' } });      // Age
    fireEvent.change(spinbuttons[1], { target: { value: '80' } });      // Weight
    fireEvent.change(spinbuttons[2], { target: { value: '180' } });     // Height
    fireEvent.change(dropdowns[0], { target: { value: 'male' } });      // Gender
    fireEvent.change(dropdowns[1], { target: { value: 'medium' } });    // Activity
    fireEvent.change(dropdowns[2], { target: { value: 'maintenance' }}); // Goal
    
    // Submit form
    fireEvent.submit(screen.getByRole('button', { name: 'Calculate' }).closest('form'));
    
    // Verify API call
    expect(axios.get).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/recommended-calories',
      {
        params: {
          age: '30',
          weight: '80',
          height: '180',
          gender: 'male',
          activity_level: 'medium',
          target: 'maintenance',
        },
      }
    );
    
    // Wait for results to appear
    await waitFor(() => {
      expect(screen.getByText('Recommended Calories: 2500')).toBeInTheDocument();
    });
  });
  
  test('adjusts calories for weight loss goal', async () => {
    // Mock successful API response
    axios.get.mockResolvedValueOnce({
      data: { recommended_calories: 2500 }
    });
    
    render(<CalorieRecommendations />);
    
    // Get all input fields by their roles and indices
    const spinbuttons = screen.getAllByRole('spinbutton');
    const dropdowns = screen.getAllByRole('combobox');
    
    // Fill out the form
    fireEvent.change(spinbuttons[0], { target: { value: '30' } });      // Age
    fireEvent.change(spinbuttons[1], { target: { value: '80' } });      // Weight
    fireEvent.change(spinbuttons[2], { target: { value: '180' } });     // Height
    fireEvent.change(dropdowns[0], { target: { value: 'male' } });      // Gender
    fireEvent.change(dropdowns[1], { target: { value: 'medium' } });    // Activity
    fireEvent.change(dropdowns[2], { target: { value: 'weight loss' }}); // Weight loss goal
    
    // Submit form
    fireEvent.submit(screen.getByRole('button', { name: 'Calculate' }).closest('form'));
    
    // Wait for results - should be 2300 (2500 - 200 for weight loss)
    await waitFor(() => {
      expect(screen.getByText('Recommended Calories: 2300')).toBeInTheDocument();
    });
  });
  
  test('handles API errors', async () => {
    // Mock failed API response
    axios.get.mockRejectedValueOnce(new Error('Network error'));
    
    render(<CalorieRecommendations />);
    
    // Get all input fields by their roles and indices
    const spinbuttons = screen.getAllByRole('spinbutton');
    const dropdowns = screen.getAllByRole('combobox');
    
    // Fill out the form
    fireEvent.change(spinbuttons[0], { target: { value: '30' } });     // Age
    fireEvent.change(spinbuttons[1], { target: { value: '80' } });     // Weight
    fireEvent.change(spinbuttons[2], { target: { value: '180' } });    // Height
    fireEvent.change(dropdowns[0], { target: { value: 'male' } });     // Gender
    fireEvent.change(dropdowns[1], { target: { value: 'low' } });      // Activity
    fireEvent.change(dropdowns[2], { target: { value: 'maintenance' }}); // Goal
    
    // Submit form
    fireEvent.submit(screen.getByRole('button', { name: 'Calculate' }).closest('form'));
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch recommended calories. Please check your inputs.')).toBeInTheDocument();
    });
  });
});