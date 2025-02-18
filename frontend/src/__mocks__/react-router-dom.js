// Mock react-router-dom package
import React from 'react';

const mockedNavigate = jest.fn();
const mockedLocation = { pathname: '/workouts' };

module.exports = {
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Link: ({ to, children, className }) => <a href={to} className={className}>{children}</a>,
  useLocation: jest.fn(() => mockedLocation),
  useNavigate: jest.fn(() => mockedNavigate),
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ path, element }) => <div data-path={path}>{element}</div>,
  Navigate: ({ to, replace }) => <div data-testid={`navigate-to-${to}`} data-replace={replace}></div>,
  // Add other router exports as needed
};