// List of Imports
import { Service, Inject } from 'typedi';
import { JwtPayload } from 'jsonwebtoken';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { TransactionDto } from '@dtos/transactions/transaction.dt';
import { TransactionType } from '@common/enums/transaction-type.enum';
import { RestaurantService } from '@services/restaurants/restaurant.service';
import { RestaurantSearchInput } from '@repositories/restaurants/IRestaurant';
import { TransactionService } from '@services/transactions/transaction.service';


/**
 * Restaurant controller logic.
 */
@Service()
export class RestaurantController {
    /**
     * Constructor method.
     */
    constructor(
        @Inject(() => RestaurantService)
        private restaurantService: RestaurantService,
    
        @Inject(() => TransactionService)
        private transactionService: TransactionService
      ) {}

    /**
     * Search Resturant and save Transaction.
     * @param req - Necesary Payload.
     * @param res - Express response.
     * @param next - NextFunction error handler.
     * @returns JSON response with the List of Users.
     */
    async search(req: Request, res: Response, next: NextFunction): Promise<Response> {
        try {

            // Boundary conditions
            const user = req.user as JwtPayload;
            const { type, value, lat, lng } = req.query;
    
            // Interface Implemntation
            let input: RestaurantSearchInput;

            if (type === TransactionType.CITY) {
                // Input: City (String)
                input = { type: TransactionType.CITY, value: (value as string).trim() };
            } else {
                // Input: Coordinates (Numbers)
                input = {
                    type: TransactionType.COORDINATES,
                    lat: Number(lat),
                    lng: Number(lng),
                };
            }
    
            // Execute Services: Search 
            const restaurants = await this.restaurantService.searchRestaurants(input);

            // Execute Services: Save Transaction
            const transactionDto = plainToInstance(TransactionDto, {
                userId: user.id, 
                type: type,
                location: type === TransactionType.CITY ? (value as string).trim() : undefined,
                latitude: lat ? Number(lat) : undefined,
                longitude: lng ? Number(lng) : undefined,
                createdAt: new Date().toISOString(),
            });
    
            await validateOrReject(transactionDto); 
            await this.transactionService.save(transactionDto);
    
            return res.json(restaurants);
        } catch (error) {
            next(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}