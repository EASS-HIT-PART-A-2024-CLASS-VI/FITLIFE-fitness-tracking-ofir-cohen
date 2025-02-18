import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FitnessBot from '../components/FitnessBot';

// Mock fetch API
global.fetch = jest.fn();

describe('FitnessBot Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  
  test('renders initial state correctly', () => {
    render(<FitnessBot />);
    
    // Check heading
    expect(screen.getByText('FITNESS BOT')).toBeInTheDocument();
    
    // Check input and button
    expect(screen.getByPlaceholderText('Ask a fitness/nutrition question...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeInTheDocument();
    
    // No messages should exist initially
    expect(screen.queryByText('Thinking...')).not.toBeInTheDocument();
  });
  
  test('sends messages and displays response', async () => {
    // Mock successful API response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ response: 'To build muscle, focus on progressive overload and protein intake.' }),
    });
    
    render(<FitnessBot />);
    
    // Type a question
    const inputField = screen.getByPlaceholderText('Ask a fitness/nutrition question...');
    fireEvent.change(inputField, { target: { value: 'How do I build muscle?' } });
    
    // Send the message
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    
    // Check if user message appears
    expect(screen.getByText('How do I build muscle?')).toBeInTheDocument();
    
    // Check if loading indicator appears
    expect(screen.getByText('Thinking...')).toBeInTheDocument();
    
    // Wait for response
    await waitFor(() => {
      expect(screen.getByText('To build muscle, focus on progressive overload and protein intake.')).toBeInTheDocument();
      expect(screen.queryByText('Thinking...')).not.toBeInTheDocument();
    });
    
    // Verify fetch was called with correct params
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:8001/chatbot/llm_chatbot/',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: 'How do I build muscle?' }),
      })
    );
  });
  
  test('handles API errors gracefully', async () => {
    // Mock failed API response
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ detail: 'Server error' }),
    });
    
    render(<FitnessBot />);
    
    // Type and send a question
    const inputField = screen.getByPlaceholderText('Ask a fitness/nutrition question...');
    fireEvent.change(inputField, { target: { value: 'Will this fail?' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    
    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
    });
  });
  
  test('handles enter key press', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ response: 'Testing enter key' }),
    });
    
    render(<FitnessBot />);
    
    // Type a question
    const inputField = screen.getByPlaceholderText('Ask a fitness/nutrition question...');
    fireEvent.change(inputField, { target: { value: 'Test question' } });
    
    // Press Enter key
    fireEvent.keyDown(inputField, { key: 'Enter', code: 'Enter' });
    
    // Check if message was sent
    expect(screen.getByText('Test question')).toBeInTheDocument();
  });
});