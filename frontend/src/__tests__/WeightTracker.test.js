import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import WeightTracker from '../components/WeightTracker';

// Mock chart.js components
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mocked-line-chart" />
}));

// Mock fetch API
global.fetch = jest.fn();

describe('WeightTracker Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    jest.clearAllMocks();
    
    // Setup localStorage mock
    const localStorageMock = {
      getItem: jest.fn(key => {
        if (key === 'user_id') return '123';
        return null;
      }),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
  });
  
  test('renders initial state with empty logs', async () => {
    // Mock API response with empty logs
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ logs: [] })
    });
    
    render(<WeightTracker />);
    
    // Wait for component to load data
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/weight/123');
    });
    
    // Check headings and filter buttons
    expect(screen.getByText('Weight Tracker')).toBeInTheDocument();
    expect(screen.getByText('Last 7 days')).toBeInTheDocument();
    expect(screen.getByText('Last 30 days')).toBeInTheDocument();
    expect(screen.getByText('Last 90 days')).toBeInTheDocument();
    expect(screen.getByText('Last 180 days')).toBeInTheDocument();
    expect(screen.getByText('Last year')).toBeInTheDocument();
    expect(screen.getByText('All time')).toBeInTheDocument();
    
    // Check empty state message
    expect(screen.getByText('No weight logs available. Add some data to see your progress!')).toBeInTheDocument();
  });
  
  test('renders weight logs with chart', async () => {
    // Mock API response with logs
    const mockLogs = [
      { date: '2023-01-01', weight: 80.5 },
      { date: '2023-01-05', weight: 79.8 },
      { date: '2023-01-10', weight: 79.2 }
    ];
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ logs: mockLogs })
    });
    
    render(<WeightTracker />);
    
    // Wait for component to load and render chart
    await waitFor(() => {
      expect(screen.queryByText('No weight logs available. Add some data to see your progress!')).not.toBeInTheDocument();
      expect(screen.getByTestId('mocked-line-chart')).toBeInTheDocument();
    });
  });
  
  test('adds a new weight log', async () => {
    // Mock API responses
    fetch.mockImplementation((url, options) => {
      if (options && options.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true })
        });
      } else {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ logs: [] })
        });
      }
    });
    
    render(<WeightTracker />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/weight/123');
    });
    
    // Fill in weight log form
    const today = new Date().toISOString().split('T')[0];
    fireEvent.change(screen.getByPlaceholderText('Weight (kg)'), { target: { value: '78.5' } });
    fireEvent.change(screen.getByDisplayValue(''), { target: { value: today } });
    
    // Submit new weight log
    fireEvent.click(screen.getByText('Add weight Log'));
    
    // Verify POST request was made with correct data
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://127.0.0.1:8000/weight',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: 123,
            weight: 78.5,
            date: today
          })
        })
      );
    });
  });
  
  test('handles filter buttons click events', async () => {
    // Mock initial API response with logs
    const mockLogs = [
      { date: '2023-01-01', weight: 80.5 },
      { date: '2023-02-01', weight: 79.8 },
      { date: '2023-03-01', weight: 79.2 }
    ];
    
    // Setup fetch mock to always return logs
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ logs: mockLogs })
    });
    
    render(<WeightTracker />);
    
    // Wait for initial logs to be fetched
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/weight/123');
    });
    
    // Find filter buttons
    const filterButtons = screen.getAllByRole('button');
    const thirtyDaysButton = screen.getByText('Last 30 days');
    
    // Make sure 30-day filter button exists
    expect(thirtyDaysButton).toBeInTheDocument();
    
    // Simply verify we can click the filter button without errors
    await act(async () => {
      fireEvent.click(thirtyDaysButton);
    });
    
    // Test passes if no errors were thrown during filter button click
  });
  
  test('handles missing user ID', async () => {
    // Override the localStorage mock for this specific test
    window.localStorage.getItem.mockImplementation(() => null);
    
    render(<WeightTracker />);
    
    // Wait for component to stabilize
    await waitFor(() => {
      // Empty state should be visible when user ID is missing
      expect(screen.getByText('No weight logs available. Add some data to see your progress!')).toBeInTheDocument();
    });
    
    // Fetch should not be called without a valid user ID
    expect(fetch).not.toHaveBeenCalled();
  });
});