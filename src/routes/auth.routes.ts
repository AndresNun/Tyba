// List of Imports
import { Router } from 'express';
import { Container } from 'typedi';
import { AuthController } from '@controllers/auth.controller';
import { authenticateJWT } from '@middlewares/auth.middleware';
import { wrapAsync, wrapHandlerInstance } from '@middlewares/asyncHandler';


/**
 * Create Express route with passed controller
 */
export function createAuthRouter() {
    // Boundary contitions
    const authController = Container.get(AuthController);
    const router = Router();

    // Endpoints
    router.post('/login', wrapHandlerInstance(authController, 'login'));

    router.delete(
        '/logout',
        wrapAsync(authenticateJWT),   // <-- Aquí el cambio
        wrapHandlerInstance(authController, 'logout')
      );

    return router;
}