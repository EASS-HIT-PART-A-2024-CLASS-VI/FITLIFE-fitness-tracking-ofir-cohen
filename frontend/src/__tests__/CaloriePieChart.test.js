import React from 'react';
import { render, screen } from '@testing-library/react';
import CaloriePieChart from '../components/CaloriePieChart';

// Mock the react-chartjs-2 module
jest.mock('react-chartjs-2', () => ({
  Pie: () => <div data-testid="mocked-pie-chart" />
}));

describe('CaloriePieChart Component', () => {
  test('renders with no food logs', () => {
    render(<CaloriePieChart />);
    
    // Check if heading is rendered
    expect(screen.getByText('Calorie Distribution')).toBeInTheDocument();
    
    // Check if empty message is displayed when no logs are provided
    expect(screen.getByText('No food logs available. Start adding to visualize your calorie distribution!')).toBeInTheDocument();
  });

  test('renders pie chart when food logs are provided', () => {
    const foodLogs = [
      { food: 'Apple', calories: 95 },
      { food: 'Chicken', calories: 335 }
    ];
    
    render(<CaloriePieChart foodLogs={foodLogs} />);
    
    // Check if heading is rendered
    expect(screen.getByText('Calorie Distribution')).toBeInTheDocument();
    
    // Check if chart is rendered (not the empty message)
    expect(screen.queryByText('No food logs available. Start adding to visualize your calorie distribution!')).not.toBeInTheDocument();
    
    // Check if mocked chart is rendered
    expect(screen.getByTestId('mocked-pie-chart')).toBeInTheDocument();
  });
});