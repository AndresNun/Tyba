// List of Imports
import Redis, { Redis as RedisClient } from 'ioredis';
import { redisConfig } from './redis.config';


/**
 * Design Pattern: Singleton (database connection)
 * Unique database connection instance within the App.
 */
export class RedisService {
    private static instance: RedisService; // Instance
    private client: RedisClient;           // Redis Client
    private isConnected = false;           // Connection

     /**
     * Constructor: Initilize DataSorce with the Database Config
     */
    private constructor() {
        this.client = new Redis(redisConfig);

        this.client.on('connect', () => {
            this.isConnected = true;
            console.log('[RedisService] Connected to Redis');
        });

        this.client.on('error', (err) => {
            this.isConnected = false;
            console.error('[RedisService] Redis error:', err);
        });
    }

    /**
     * Returns the Singleton Instance.
     * Creates one if it does not exist yet.
     * @returns {RedisService}
     */
    public static getInstance(): RedisService {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }

    /**
     * Initializes the Database Connection.
     * @returns {Promise<void>}
     * @throws {Error} Throws if initialization fails.
     */
    public getClient(): RedisClient {
        return this.client;
    }

    /**
     * Restarts the Database Connection.
     * 
     * @returns {Promise<void>}
     * @throws {Error} Throws if reconnection fails.
     */
    public async disconnect(): Promise<void> {
        if (this.isConnected) {
            await this.client.quit();
            this.isConnected = false;
            console.log('[RedisService] Disconnected from Redis');
        }
    }
}