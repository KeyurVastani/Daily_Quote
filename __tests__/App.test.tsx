/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('react-native-encrypted-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  },
}));

test('renders correctly', async () => {
  jest.useFakeTimers();

  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });

  // SplashOverlay: visible ~2s + fade ~0.5s
  await ReactTestRenderer.act(() => {
    jest.advanceTimersByTime(3000);
  });

  jest.useRealTimers();
});
