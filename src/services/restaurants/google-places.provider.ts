// List of Imports
import axios from 'axios';
import { restaurantConfig } from '@config/index';
import { TransactionType } from '@common/enums/transaction-type.enum';
import { IRestaurantProvider, Restaurant, RestaurantSearchInput } from '@repositories/restaurants/IRestaurant';

/**
 * Google service provider
 */
export class GooglePlacesProvider implements IRestaurantProvider {
  // Boundary conditions
  private readonly googlePlacesConfig = restaurantConfig.google.googlePlacesConfig
  private readonly apiKey = this.googlePlacesConfig.apiKey;
  private readonly placesUrl = this.googlePlacesConfig.placesUrl;
  private readonly geocodeUrl = this.googlePlacesConfig.geocodeUrl;

  private readonly searchRadius = 1500;
  private readonly placeType = 'restaurant';
  private readonly discardType = 'lodging';


  /**
   * Methods dispatch base on the use case
   * 
   * @param input - Search input type: city or coordinates
   * @return List of restaurants
  */
  async search(input: RestaurantSearchInput): Promise<Restaurant[]> {
    if (input.type === TransactionType.CITY) {
      return this.searchByLocation(input.value);
    } else if (input.type === TransactionType.COORDINATES) {
      return this.searchByCoordinates(input.lat, input.lng);
    }
    throw new Error('Invalid search input type');
  }

  /**
   * Location Search - User coordinates
   * 
   * @param latitude - City's latitudes
   * @param longitude - City's longitude
   * @return List of restaurants
  */
  async searchByCoordinates(latitude: number, longitude: number): Promise<Restaurant[]> {
    if (latitude === undefined || longitude === undefined || isNaN(latitude) || isNaN(longitude)) {
      throw new Error('Latitude and longitude are required and must be numbers');
    }

    // Geocode City's name
    try {
      const location = `${latitude},${longitude}`;

      // Setup
      const response = await axios.get(this.placesUrl, {
        params: {
          location: location,
          radius: this.searchRadius,
          type: this.placeType,
          key: this.apiKey,
        },
      });

      // Response: Satus and Results
      const { status, results } = response.data;
      if (status === 'ZERO_RESULTS') return [];
      if (status !== 'OK') {
        throw new Error(`Google Places API error: ${status}`);
      }

      return this.mapToRestaurants(results);
    } catch (error: any) {
      throw new Error(`Failed to fetch restaurants: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Location Search - Decode location's name
   * 
   * @param location - City's name
   * @return Resaurants lists
   */
  async searchByLocation(location: string): Promise<Restaurant[]> {
    if (!location.trim()) {
      throw new Error('Location is required');
    }

    console.log('✅ API Key used for Google:', this.apiKey);

    // Geocode City's name
    try {
      const { data } = await axios.get(this.geocodeUrl, {
        params: {
          address: location,
          key: this.apiKey,
        },
      });

      console.log('Google Geocode response data:', JSON.stringify(data, null, 2));
  
      if (!data.results.length) {
        throw new Error(`No coordinates found for: ${location}`);
      }
  
      const { lat, lng } = data.results[0].geometry.location;
      return this.searchByCoordinates(lat, lng);
  
    } catch (error: any) {
      throw new Error(`Failed to search by location: ${error?.message || 'Unknown error'}`);
    }
  }

  /**
   * Map of the Google Places results data structure
   * 
   * @param results - Raw results from Google API
   * @returns List of restaurants
   */
  private mapToRestaurants(results: any[]): Restaurant[] {
    return results
      .filter(place => place.types && place.types.includes(this.placeType) && !place.types.includes(this.discardType))
      .map((place: any): Restaurant => ({
        name: place.name,
        address: place.vicinity || place.formatted_address || 'Unknown address',
        rating: place.rating ?? 0,
      }));
  }
}