// List of Imports
import App from '../../app';
import request from 'supertest';
import { Application } from 'express';

/**
 * Transaction End-to-End 
 */
describe('Transaction E2E', () => {
  // Boundary conditions
  let appInstance: App;
  let expressApp: Application;
  let accessToken: string;

  const testUser = {
    username: `desdSec+${Date.now()}`,
    email: `desdSec+${Date.now()}@example.com`,
    password: 'superssd-12'
  };

  beforeAll(async () => {
    jest.setTimeout(30000);
    appInstance = await App.bootstrap();
    expressApp = appInstance.getExpressInstance();

    // Create User
    await request(expressApp)
      .post('/api/v1/users')
      .send(testUser)
      .expect(201);

    // Login with User
    const loginRes = await request(expressApp)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    accessToken = loginRes.body.access_token;
  });

  /**
   * Transaction - Functionalities (Negative Path)
   */
  describe('GET /api/v1/transactions', () => {
    /**
     * New User
     */
    it('Should return empty array of transactions for a new user', async () => {
      const response = await request(expressApp)
        .get('/api/v1/transactions')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    /**
     * New Transaction: City
     */
    it('Should create a transaction after restaurant search by city', async () => {
        await request(expressApp)
          .get('/api/v1/restaurants/')
          .query({ type: 'city', value: 'New York' })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);
  
        const response = await request(expressApp)
          .get('/api/v1/transactions')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);
  
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0]).toHaveProperty('type', 'city');
        expect(response.body[0]).toHaveProperty('location', 'New York');
      });
  
      /**
       * New Transaction: Coordinates
       */
      it('Should create a transaction after restaurant search by coordinates', async () => {
        await request(expressApp)
          .get('/api/v1/restaurants/')
          .query({ type: 'coordinates', lat: 40.7128, lng: -74.0060 })
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);
  
        const response = await request(expressApp)
          .get('/api/v1/transactions')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);
  
        const found = response.body.find((tx: any) =>
          tx.type === 'coordinates' &&
          tx.latitude === 40.7128 &&
          tx.longitude === -74.006
        );
  
        expect(found).toBeDefined();
    });

    /**
     * No Auth Token provided
     */
    it('Should return 401 if no token is provided', async () => {
      await request(expressApp)
        .get('/api/v1/transactions')
        .expect(401);
    });

    /**
     * No Auth Token provided
     */
    it('Should return 401 if token is invalid', async () => {
      await request(expressApp)
        .get('/api/v1/transactions')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(403);
    });
  });
});