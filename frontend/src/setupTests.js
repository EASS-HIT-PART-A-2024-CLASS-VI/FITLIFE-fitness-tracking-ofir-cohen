// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Chart.js registry to avoid errors
jest.mock('chart.js', () => {
  return {
    Chart: {
      register: jest.fn(),
    },
    ArcElement: jest.fn(),
    LineElement: jest.fn(),
    PointElement: jest.fn(),
    CategoryScale: jest.fn(),
    LinearScale: jest.fn(),
    Title: jest.fn(),
    Tooltip: jest.fn(),
    Legend: jest.fn(),
  };
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock the ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.alert
window.alert = jest.fn();

// Mock window.open
window.open = jest.fn();

// Completely suppress React act() warnings to avoid console noise in tests
const originalConsoleError = console.error;
console.error = (...args) => {
  // Skip all act() warnings
  if (
    /Warning.*not wrapped in act/.test(args[0]) || 
    /Error in chatbot request/.test(args[0]) ||
    /inside a test was not wrapped in act/.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Clean up between tests
beforeEach(() => {
  window.alert.mockClear();
  window.open.mockClear();
  
  // Reset any mocked functions to prevent state leakage between tests
  if (global.fetch && typeof global.fetch.mockClear === 'function') {
    global.fetch.mockClear();
  }
});

// Global teardown
afterAll(() => {
  // Restore original console.error
  if (originalConsoleError) {
    console.error = originalConsoleError;
  }
});