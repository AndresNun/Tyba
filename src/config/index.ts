// Index configuration
import * as jwt from './auth/jwt.config';
import * as redisMain from './database/redis/redis';
import * as databaseMain from './database/postgre/database';
import * as database from './database/postgre/database.config';
import * as redisDatabase from './database/redis/redis.config';
import * as google from './restaurants/google-places.config';

/**
 * Database config
 */
export const databaseConfig = {
  dbConfig: database,
  database: databaseMain
};

/**
 * Redis client
 */
export const redisConfig = {
  redisConfig: redisDatabase,
  redisDatabase: redisMain
}

/**
 * JWT config
 */
export const authConfig = {
  authConfig: jwt
};

/**
 * Reaturant config
 */
export const restaurantConfig = {
  google
};