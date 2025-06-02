// List of Imports
import 'module-alias/register';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { entities } from '@entities';
import { migrations } from '@migrations';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';

/**
 * Load enviroment variables
 */
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `../../../.env.${env}`) });

/**
 * Validations: .env 
 */
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_POSTGRES'];
const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
    console.error('The following enviroment variables are missing:');
    missingVars.forEach((key) => console.error(`- ${key}`));
    throw new Error('Configuration error: enviroment variables are missing.');
}

/**
 * Database configuration
 */
export const dbConfig: PostgresConnectionOptions = {
    type: 'postgres',
    name: "default",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    database: process.env.DB_POSTGRES,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: entities,
    migrations: migrations,
    migrationsRun: true,
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy(),
    logging: process.env.NODE_ENV === 'development',
    extra: {
        max: 2, 
        idleTimeoutMillis: 30000, 
      }
}

/**
 * Create new instance of the Database
 */
const AppDataSource = new DataSource(dbConfig);
export default AppDataSource;