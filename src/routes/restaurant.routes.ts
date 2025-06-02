// List of Imports
import { Router } from 'express';
import { Container } from 'typedi';
import { authenticateJWT } from '@middlewares/auth.middleware';
import { validateSearch } from '@middlewares/restaurant.middleware'; 
import { validateRequest } from '@middlewares/validation.middleware';
import { RestaurantController } from '@controllers/reaturant.controller';
import { wrapAsync, wrapHandlerInstance } from '@middlewares/asyncHandler';

/**
 * Create Express route with passed controller
 */
export function createRestaurantRouter() {
    // Boundary conditions
    const restaurantController = Container.get(RestaurantController);
    const router = Router();

    // Endpoint
    router.get(
      '/',
      wrapAsync(authenticateJWT),
      validateRequest(validateSearch),
      wrapHandlerInstance(restaurantController, 'search')
    );

    return router;
}
