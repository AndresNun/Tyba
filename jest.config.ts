// jest.config.js
require('dotenv').config({ path: '.env.development' });

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/test'],
  testMatch: ['**/e2e/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^app$': '<rootDir>/src/app.ts',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@config$': '<rootDir>/src/config/index.ts',
    '^@entities/(.*)$': '<rootDir>/src/entities/$1',
    '^@entities$': '<rootDir>/src/entities/index.ts',
    '^@migrations/(.*)$': '<rootDir>/src/migrations/$1',
    '^@migrations$': '<rootDir>/src/migrations/index.ts',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@routes$': '<rootDir>/src/routes/index.ts',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@repositories/(.*)$': '<rootDir>/src/repositories/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
    '^@dtos/(.*)$': '<rootDir>/src/dtos/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@test/(.*)$': '<rootDir>/src/test/$1',
  },
};

module.exports = config;