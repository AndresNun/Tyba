// List of Imports
import * as path from 'path';
import * as dotenv from 'dotenv';
import Redis from 'ioredis';
import type { RedisOptions } from 'ioredis';

/**
 * Load environment variables
 */
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `../../../.env.${env}`) });

/**
 * Validations: .env
 */
const requiredEnvVars = ['REDIS_HOST', 'REDIS_PORT', 'REDIS_PASSWORD'];
const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
    console.error('The following environment variables are missing:');
    missingVars.forEach((key) => console.error(`- ${key}`));
    throw new Error('Configuration error: environment variables are missing.');
}

/**
 * Redis configuration options
 */
export const redisConfig: RedisOptions = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
};