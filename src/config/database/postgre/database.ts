// List of Imports
import { Container } from 'typedi';
import { dbConfig } from './database.config';
import { DataSource, EntityManager, useContainer as ormUseContainer } from "typeorm";

/**
 * Design Pattern: Singleton (database connection)
 * Unique database connection instance within the App.
 */
export class DatabaseService {

    private static instance: DatabaseService;   // Singleton instance
    private dataSource: DataSource;             // TypeORM DataSource instance
    private entityManager!: EntityManager;      // Entity manager
    private isInitialized: boolean = false;     // Connection status

  
    /**
     * Constructor: Initilize DataSorce with the Database Config
     */
    private constructor() {
        this.dataSource = new DataSource(dbConfig);
    }

    /**
     * Returns the Singleton Instance.
     * Creates one if it does not exist yet.
     * @returns {DatabaseService}
     */
    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    /**
     * Initializes the Database Connection.
     * @returns {Promise<void>}
     * @throws {Error} Throws if initialization fails.
     */
    public async connect(): Promise<void> {
        if (this.isInitialized) {
            console.log('[DatabaseService] Connection already initialized.');
            return
        }

        console.log('[DatabaseService] Initializing data source connection...');
        try {
            await this.dataSource.initialize();
            this.entityManager = this.dataSource.manager;
            this.isInitialized = true;
            Container.set(DataSource, this.dataSource);
            console.log('[DatabaseService] Database connected successfully.');
        } catch (error) {
            console.error('[DatabaseService] Failed to initialize database connection:', error);
            throw new Error(`Failed to initialize database connection: ${error}`);
        }
    }

    /**
     * Restarts the Database Connection.
     * 
     * @returns {Promise<void>}
     * @throws {Error} Throws if reconnection fails.
     */
    public async restartConnection(): Promise<void> {
        try {
            if (this.isInitialized) {
                await this.close();
            }
            await this.connect();
        } catch (error) {
            throw new Error(`Failed to restart the database connection: ${error}`);
        }
    }

    /**
     * Closes the Database Connection.
     * @returns {Promise<void>}
     */
    public async close(): Promise<void> {
        if (this.isInitialized) {
            await this.dataSource.destroy();
            this.isInitialized = false;
        }
    }

    /**
     * Returns the DataSource ORM Type.
     * @returns {DataSource}
     */
    public getDataSource(): DataSource {
        return this.dataSource;
    }

    /**
     * Returns the EntityManager if connection is initialized.
     * @returns {EntityManager}
     * @throws {Error} If connection is not initialized.
     */
    public getEntityManager(): EntityManager {
        if (!this.isInitialized) {
            throw new Error('Database connection is not initialized.');
        }
        return this.entityManager;
    }
}