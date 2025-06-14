import App from '../../app';
import { Application } from 'express';
import request from 'supertest';
import { JwtPayload } from 'jsonwebtoken';
import { TransactionType } from '@common/enums/transaction-type.enum';


/**
 * Restaurant End-to-End 
 */
describe('Restaurant Search E2E', () => {
  // Boundary conditions
  let appInstance: App;
  let expressApp: Application;
  let accessToken: string;

  const testUser = {
    username: `mati+${Date.now()}`,
    email: `betgum+${Date.now()}@example.com`,
    password: 'supersa-12'
  };

  beforeAll(async () => {
    jest.setTimeout(30000);
    appInstance = await App.bootstrap();
    expressApp = appInstance.getExpressInstance();

    // User create
    await request(expressApp)
      .post('/api/v1/users')
      .send({ username: testUser.username, email: testUser.email, password: testUser.password })
      .expect(201);

    // User login
    const loginResponse = await request(expressApp)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    accessToken = loginResponse.body.access_token;
  });


  /**
   * Restaurant search
   */
  describe('GET /api/v1/restaurants/', () => {
    /**
     * Restaurant Search by City
     */
    it('Return Restaurants when searching by: city', async () => {
      const city = 'New York';

      const response = await request(expressApp)
        .get('/api/v1/restaurants/')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ type: TransactionType.CITY, value: city })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
    
    /**
     * Restaurant Search by coordinates
     */
    it('Return Restaurants when searching by: coordinates', async () => {
      const lat = 40.7128;
      const lng = -74.006;

      const response = await request(expressApp)
        .get('/api/v1/restaurants/')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ type: TransactionType.COORDINATES, lat, lng })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    /**
     * Wrong structure
     */
    it('Should return 400 if required query params are missing or invalid', async () => {
      // Value: City name missing
      await request(expressApp)
        .get('/api/v1/restaurants/')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ type: TransactionType.CITY })
        .expect(400);

      // Latitude and longitude missing for coodinates
      await request(expressApp)
        .get('/api/v1/restaurants/')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ type: TransactionType.COORDINATES, lat: 'abc', lng: 'xyz' })
        .expect(400);

      // Invalid type
      await request(expressApp)
        .get('/api/v1/restaurants/')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ type: 'INVALID' })
        .expect(400);
    });


    /**
     * With Auth Token
     */
    it('Should return 403 if token is missing or invalid', async () => {
      await request(expressApp)
        .get('/api/v1/restaurants/')
        .query({ type: TransactionType.CITY, value: 'New York' })
        .expect(401);

      await request(expressApp)
        .get('/api/v1/restaurants/')
        .set('Authorization', 'Bearer invalid_token')
        .query({ type: TransactionType.CITY, value: 'New York' })
        .expect(403);
    });
  });
});
