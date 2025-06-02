// List of Imports
import "reflect-metadata";
import 'module-alias/register';
import { Container } from "typedi";
import { useContainer as ormUseContainer } from "typeorm";

ormUseContainer(Container); // TypeDI with TypeORM
console.log('[App] Setting up TypeDI container for TypeORM...');
import "@services/user/user.service";
import "@services/auth/auth.service"
import "@services/restaurants/restaurant.service"
import "@services/transactions/transaction.service"
import "@repositories/user/UserRepository";
import "@repositories/transactions/TransactionRepository"
import express, { Application } from 'express';
import { createMainRouter } from "@routes/index";
import { DataSource, EntityManager } from "typeorm";
import { DatabaseService } from '@config/database/postgre/database';
import { errorHandler } from '@middlewares/errorHandler';
import cors from 'cors';


/**
 * Main application class to setup DB connection, middlewares, and routes.
 */
class App {
    public app: Application;
    public databaseService: DatabaseService;

    /**
     * Initialize express app and database service instance.
     */
    constructor() {
        console.log('[App] Initializing express app and database service...');
        this.app = express();
        this.databaseService = DatabaseService.getInstance();
    }

    /**
     * Initializes Database Connection
     * @throws Will exit the process if Database Connection fails.
     */
    private async initializeDatabase(): Promise<void> {
        console.log('[App] Connecting to database...');
        try {
            await this.databaseService.connect();
            const dataSource = this.databaseService.getDataSource();
            console.log(`[App] Database connected. DataSource initialized: ${dataSource.isInitialized}`);
        } catch (error) {
            console.error('[App] Cannot start app, DB connection failed:', error);
            process.exit(1);
        }
    }

    /**
     * Returns the Data Source
     * @returns {DataSource}
     */
    public getDataSource(): DataSource {
        return this.databaseService.getDataSource();
    }

    /**
     * Returns the Database Entity Manager
     * @returns {EntityManager}
     */
    public getDatabaseManager(): EntityManager {
        return this.databaseService.getEntityManager();
    }

    public configureMiddlewares() {
        console.log('[App] Configuring middlewares...');
        this.app.use(cors({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true, 
        }));
        this.app.use(express.json());
    }

    public async configureRoutes() {
        const apiPrefix = process.env.API_PREFIX || '/api/v1';
        console.log(`[App] Configuring routes with prefix: ${apiPrefix}`);
    
        try {
            const mainRouter = createMainRouter();
            this.app.use(apiPrefix, mainRouter);
            console.log('[App] All routes configured.');
        } catch (err) {
            console.error('[App] Failed to configure routes:', err);
            throw err;
        }
        this.app.use(errorHandler as any);
    }
     
    /**
     * Starts the Server
     */
    public async initializeServer() {
        console.log('[App] Starting server initialization...');
        await this.initializeDatabase();
        this.configureMiddlewares();
        await this.configureRoutes();
        console.log('[App] Server initialization completed.');
    }

    /**
     * Handle init order
     */
    public static async bootstrap(): Promise<App> {
        const appInstance = new App();
        await appInstance.initializeServer();
        return appInstance;
    }

    /**
     * Getter
     */
    public getExpressInstance(): Application {
        return this.app;
    }
}

export default App;