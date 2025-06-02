// List of Imports
import { Router } from 'express';
import { Container } from 'typedi';
import { UserController } from '@controllers/user.controller';
import { wrapHandlerInstance } from '@middlewares/asyncHandler';


/**
 * Create Express route with passed controller
 */
export function createUserRouter() {
    // Boundary contitions
    const userController = Container.get(UserController);
    const router = Router();

    // Endpoints
    router.post('/', wrapHandlerInstance(userController, 'create'));
    router.get('/', wrapHandlerInstance(userController, 'getAllUsers'));
    router.get('/:id', wrapHandlerInstance(userController, 'getUserById'));

    return router;
}