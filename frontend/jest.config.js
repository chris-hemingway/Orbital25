export default {
    testEnvironment: 'jsdom', // For DOM testing (React components)
    moduleFileExtensions: ['js', 'jsx', 'json'], // Add 'json' if needed
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest', // Transform JS/JSX with Babel
    },
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
      '^@/(.*)$': '<rootDir>/src/$1', // Alias support (adjust if using path aliases)
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'], // For RTL matchers
    testMatch: ['**/__tests__/**/*.test.(js|jsx)'], // Test file pattern
  };