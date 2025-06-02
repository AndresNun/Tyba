// List of Imports
import 'module-alias/register';
import 'reflect-metadata';
import App from './app';
import dotenv from 'dotenv';

/**
 * Load environment variables based on NODE_ENV
 */
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

/**
 * Define port with fallback
 */
const PORT = Number(process.env.PORT) || 8000;

/**
 * Starts the application server
 */
async function startServer(): Promise<void> {
  try {
    const appInstance = await App.bootstrap(); 
    appInstance.app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT} in ${env} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();