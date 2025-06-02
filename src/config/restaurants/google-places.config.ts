// List of Imports
import 'module-alias/register';
import * as path from 'path';
import * as dotenv from 'dotenv';
/**
 * Google configuration
 */
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(__dirname, `../../../.env.${env}`) });
const GOOGLE_API_BASE = 'https://maps.googleapis.com/maps/api';

const ENDPOINTS = {
  places: '/place/nearbysearch/json',
  geocode: '/geocode/json',
};

export const googlePlacesConfig = {
  apiKey: process.env.GOOGLE_PLACES_API_KEY || '',
  placesUrl: `${GOOGLE_API_BASE}${ENDPOINTS.places}`,
  geocodeUrl: `${GOOGLE_API_BASE}${ENDPOINTS.geocode}`,
};