/**
 * Ultimate Contest Radar - Test Setup
 * This file runs before each test file and sets up the testing environment
 */

import '@testing-library/jest-dom';

// Mock IntersectionObserver
(global as any).IntersectionObserver = class IntersectionObserver {
  observe(): void {}
  disconnect(): void {}
  unobserve(): void {}
};

// Mock ResizeObserver
(global as any).ResizeObserver = class ResizeObserver {
  observe(): void {}
  disconnect(): void {}
  unobserve(): void {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
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

// Mock window.requestAnimationFrame
global.requestAnimationFrame = (callback) => {
  return setTimeout(callback, 0);
};

// Mock window.cancelAnimationFrame
global.cancelAnimationFrame = (id) => {
  clearTimeout(id);
};

// Suppress console warnings during tests unless specifically testing for them
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };

  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('ReactDOM.render is no longer supported') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
