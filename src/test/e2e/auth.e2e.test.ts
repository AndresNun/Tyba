// List of Imports
import App from '../../app';
import { Application } from 'express';
import request from 'supertest';


/**
 * Auth End-to-End 
 */
describe('Auth E2E Tests', () => {
    // Boundary conditions
    let appInstance: App;
    let expressApp: Application;

    const testUser = {
        username: `caelumNoc+${Date.now()}`,
        email: `caelumNoc+${Date.now()}@example.com`,
        password: 'super-12'
    };
      
    beforeAll(async () => {
        jest.setTimeout(30000);
        appInstance = await App.bootstrap(); 
        expressApp = appInstance.getExpressInstance(); 

        // Create User
        await request(expressApp)
            .post('/api/v1/users')  
            .send({ username: testUser.username, email: testUser.email, password: testUser.password })
            .expect(201);
    });

        
    /**
     * Login - Functionality
     */
    describe('POST /api/v1/auth/login', () => {

        /**
         * Valid Credentials
         */
        it('Should return 200 and token for valid credentials', async () => {
        const response = await request(expressApp)
            .post('/api/v1/auth/login')
            .send({ email: testUser.email, password: testUser.password })
            .expect(200);

        expect(response.body).toHaveProperty('access_token');
        expect(typeof response.body.access_token).toBe('string');
        });

        /**
        * Invalid Credentials
        */
        it('Should return 401 for invalid credentials', async () => {
        const response = await request(expressApp)
            .post('/api/v1/auth/login')
            .send({ email: 'caelum@example.com', password: 'norxscret' })
            .expect(401);

        expect(response.body).toHaveProperty('message');
        expect(response.body.message.toLowerCase()).toContain('invalid');
        });
    });

    /**
     * Logout - Functionality
     */
    describe('POST /api/v1/auth/logout', () => {
        // Boundary condiitons
        let accessToken: string;
      
        beforeAll(async () => {
          const loginResponse = await request(expressApp)
            .post('/api/v1/auth/login')
            .send({ email: testUser.email, password: testUser.password })
            .expect(200);
      
          accessToken = loginResponse.body.access_token;
        });
      
        it('Should return 200 and successfully logout with valid token', async () => {
          const response = await request(expressApp)
            .delete('/api/v1/auth/logout')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);
        
          expect(response.body).toHaveProperty('message');
          expect(response.body.message).toMatch('Logout successful');
        });
      
        it('Should return 401 if token is missing or invalid', async () => {
          await request(expressApp)
            .delete('/api/v1/auth/logout')
            .expect(401);
      
          await request(expressApp)
            .delete('/api/v1/auth/logout')
            .set('Authorization', 'Bearer token_invalid')
            .expect(403);
        });
    });      
});