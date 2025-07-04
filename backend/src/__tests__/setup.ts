import { config } from 'dotenv';
import { cacheService } from '../services/cacheService';

// Load test environment variables
config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Mock console methods to reduce noise during testing
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Clear cache before each test
beforeEach(() => {
  cacheService.flushAll();
});

// Global test timeout
jest.setTimeout(10000);
