// List of imports 
import { Router } from 'express';
import { createUserRouter } from './user.routes';
import { createAuthRouter } from './auth.routes';
import { createRestaurantRouter } from './restaurant.routes';
import { createTransactionRouter } from './transaction.routes';

/**
 * Main routing.
 */
export function createMainRouter(): Router {
    // Boundary condition
    const router = Router();

    // Endpoints
    router.use('/users', createUserRouter());
    router.use('/auth', createAuthRouter());
    router.use('/restaurants', createRestaurantRouter());
    router.use('/transactions', createTransactionRouter());

    return router;
}