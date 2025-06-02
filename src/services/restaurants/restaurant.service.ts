// List of Imports
import { Service, Inject } from "typedi";
import { GooglePlacesProvider } from '@services/restaurants/google-places.provider';
import { IRestaurantProvider, Restaurant, RestaurantSearchInput } from '@repositories/restaurants/IRestaurant';

/**
 * Restaurant Service: Implemntation of provider
 */
@Service()
export class RestaurantService {
    private provider: IRestaurantProvider;

    /**
     * Constructor method
     */
    constructor(provider?: IRestaurantProvider) {
        this.provider = provider ?? new GooglePlacesProvider();
    }

    /**
     * Google provider implementation
     * 
     * @param input - Type of search: City || Coordinates
     * @returns List of restaurants
     */
    async searchRestaurants(input: RestaurantSearchInput): Promise<Restaurant[]> {
        return this.provider.search(input);
    }
}