// List of Imports
import { Router } from 'express';
import { Container } from 'typedi';
import { authenticateJWT } from '@middlewares/auth.middleware';
import { wrapAsync, wrapHandlerInstance } from '@middlewares/asyncHandler';
import { TransactionController } from '@controllers/transaction.controller';


/**
 * Create Express route with passed controller
 */
export function createTransactionRouter() {
    // Boundary conditions
    const transactionController = Container.get(TransactionController);
    const router = Router();

    // Endpoint
    router.get(
        '/',
        wrapAsync(authenticateJWT),
        wrapHandlerInstance(transactionController, 'getTransactionsByUser')
    );

    return router;
}