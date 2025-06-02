// List of Imports
import { Request, Response, NextFunction } from 'express';
import { query, validationResult } from 'express-validator';


/**
 * Retaurant: Search validations
 */
export const validateSearch = [
    /**
     * Validation: Type
     */
    query('type')
        .exists().withMessage('type is required')
        .isIn(['city', 'coordinates']).withMessage('Type must be: City or Coordinates'),

    /**
     * Validation: Value
     */
    query('value')
        .if(query('type').equals('city'))
        .exists().withMessage('City String value is required when Type: City')
        .isString()
        .notEmpty(),

    /**
     * Validation: Latitude "lat"
     */
    query('lat')
        .if(query('type').equals('coordinates'))
        .exists().withMessage('Latitude is required when Type: Coordinates')
        .isFloat().withMessage('Latitude must be a float'),

    /**
     * Validation: Longitude "lng"
     */
    query('lng')
        .if(query('type').equals('coordinates'))
        .exists().withMessage('Longitude is required when Type: Coordinates')
        .isFloat().withMessage('Longitude must be a float'),
];