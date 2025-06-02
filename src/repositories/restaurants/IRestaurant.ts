/**
 * Restaurant interface
 */
export interface Restaurant {
    id?: string; 
    name: string;
    address: string;
    rating: number;
    location?: {
      lat: number;
      lng: number;
    };
    types?: string[];
    isOpenNow?: boolean;
  }
  
/**
 * Restaurant search type
 */
export type RestaurantSearchInput =
    | { type: 'city'; value: string }
    | { type: 'coordinates'; lat: number; lng: number };
  
/**
 * Restaurant abstraction provider
 */
export interface IRestaurantProvider {
    search(input: RestaurantSearchInput): Promise<Restaurant[]>;
}