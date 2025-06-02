# Tyba Backend Engineer Test

This repository contains the backend API developed as part of the technical challenge for the Backend Engineer position at Tyba.

---

## Table of Contents

- [Environment Setup](#environment-setup)  
  - [Prerequisites](#prerequisites)  
  - [Environment Variables](#environment-variables)  
  - [Start Services](#start-app-with-docker-compose)  
- [Docker Commands](#docker-commands)  
- [Project Architecture](#project-architecture)  
- [API Documentation](#api-documentation)  
- [Testing](#testing)  
- [Code Therapy Sessions](#code-therapy-sessions)

---

## Environment Setup

### Prerequisites

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/) (version >= 16)
- Environment files:
  - `.env.development`
  - `.env.production`
  - `.env.test`

### Environment Variables

Three environment files are used depending on the context:

- `.env.development` – for local development
- `.env.production` – for production or staging
- `.env.test` – for automated testing

Example configuration:

```env
# App Settings
PORT=8000
API_PREFIX=/api/v1
JWT_SECRET=super-secret-token
GOOGLE_PLACES_API_KEY=your_api_key
BLACKLIST_DURATION_SECONDS=3600

# PostgreSQL Settings
DB_HOST=postgres
DB_PORT=5432
DB_POSTGRES=tyba_db
DB_USERNAME=tyba_dummy
DB_PASSWORD=tyba_secret

# Redis Settings
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=tyba_secret_2
REDIS_DB=0
REDIS_PREFIX=api:

# Environment
NODE_ENV=development
```

---

## Start App with Docker Compose

To build and start the application and its services (Redis, PostgreSQL):

```bash
docker-compose build --no-cache
docker-compose up
```

After the above command the services (Redis, PostgreSQL) and de Server will be available in the: http://localhost:PORT. 

To stop and remove the containers:

```bash
npm run docker:down
```
---

## Docker Commands

| Command                      | Description                                           |
| ---------------------------- | -----------------------------------------------------|
| `docker-compose build --no-cache` | Build all services without using cache (clean build)   |
| `docker-compose up`          | Start all services defined in `docker-compose.yml`    |
| `npm run docker:down`        | Stop and remove all running containers                 |


## Project Architecture

The application is structured using the following monolithic architecture:

- **Common**: Contains enums and global variables used throughout the application.
- **Config**: Holds configurations for the database, JWT authentication, Google API, Jest (testing), and Swagger (API documentation).
- **Controllers**: Handle HTTP requests and responses.
- **Dtos**: Manage data validation and transformation.
- **Entities**: Define the database entities using TypeORM.
- **Middlewares**: Implement middlewares for request handling, authentication, error handling, etc.
- **Repositories**: Handle database access and operations using TypeORM.
- **Routes**: Define the application routes and endpoints.
- **Services**: Encapsulate the business logic.
- **Test**: Contains end-to-end testing suites.
- **Utils**: Utilities such as error handling, interfaces, and helper functions.
- **Redis**: Used for caching and throttling.
- **PostgreSQL**: The main database of the application.

Folder structure:

```
src/
│
├── common/
├── config/
├── controller/
├── dtos/
├── entities/
├── middlewares/
├── utils/
└── main.ts
```

For a bigger project it is suggested to segmentate the responsabilities by the usage of microservices.

---

## API Documentation

---

### User

Manages user-related operations.

#### User Router

- **POST `/`**  
  Create a new user (`UserController.create`).

- **GET `/`**  
  Get all users (`UserController.getAllUsers`).

- **GET `/:id`**  
  Get user by ID (`UserController.getUserById`).

Uses TypeDI for dependency injection and wraps handlers with `wrapHandlerInstance`.

---

### Authentication

Handles user login and logout with JWT for secure access.

#### Auth Router

- **POST `/login`**  
  User login (no authentication required).

- **DELETE `/logout`**  
  User logout (protected by `authenticateJWT` middleware).

Middleware wrappers:  
- `wrapAsync` to catch async errors in middleware.  
- `wrapHandlerInstance` to handle async errors in controllers.

---

### Restaurant

Handles restaurant data operations with authentication and request validation.

#### Restaurant Router

- **GET `/`**  
  Search restaurants by query parameters.  
  Requires JWT authentication (`authenticateJWT`) and validation (`validateSearch`).

Middleware wrappers:  
- `wrapAsync` for async middleware error handling.  
- `wrapHandlerInstance` for controller error handling.

---

### Transaction

Manages user transaction data.

#### Transaction Router

- **GET `/`**  
  Get transactions for the authenticated user (`TransactionController.getTransactionsByUser`).  
  Protected by `authenticateJWT`.

Middleware wrappers:  
- `wrapAsync` to handle async middleware errors.  
- `wrapHandlerInstance` for controller error handling.

---

## Testing

Expected behavior for the main user functionalities, covering both positive (successful) and negative (error) cases.

---

### User Registration

**Positive Cases:**

- **Given** a new user provides a valid username, email, and password,  
  **When** they submit the registration data,  
  **Then** the system creates the user account and confirms registration without exposing the password.

- **Given** multiple different users register simultaneously with valid information,  
  **When** they submit their data,  
  **Then** all users are successfully created without errors.

**Negative Cases:**

- **Given** some required information is missing (username, email, or password),  
  **When** the user tries to register,  
  **Then** the system responds with an error indicating which fields are missing.

- **Given** the username or email is already used by another user,  
  **When** a registration attempt is made,  
  **Then** the system blocks the registration and shows a duplication error.

- **Given** the email format is invalid,  
  **When** the registration is submitted,  
  **Then** the system notifies that the email is not valid.

- **Given** the password is too short (less than 6 characters),  
  **When** the user tries to register,  
  **Then** the system informs that the password is too short.

- **Given** the username is either too short (less than 3) or too long (more than 20 characters),  
  **When** the registration data is sent,  
  **Then** the system rejects it with an appropriate message.

---

### User Login

**Positive Cases:**

- **Given** a registered user provides correct email and password,  
  **When** they submit the login request,  
  **Then** the system authenticates them and provides access with a valid session or token.

**Negative Cases:**

- **Given** the email or password is incorrect,  
  **When** the user attempts to login,  
  **Then** the system rejects the login and shows an error message.

- **Given** the user tries to login with missing email or password,  
  **When** they submit the request,  
  **Then** the system responds with an error indicating required fields.

---

### Get Nearby Restaurants (Authenticated Endpoint)

**Positive Cases:**

- **Given** a logged-in user sends a valid city name or geographic coordinates,  
  **When** the request is processed,  
  **Then** the system returns a list of nearby restaurants based on the location.

**Negative Cases:**

- **Given** the user is not logged in,  
  **When** they try to access the restaurants endpoint,  
  **Then** the system denies access with an authentication error.

- **Given** the location data is missing or invalid,  
  **When** the user makes the request,  
  **Then** the system responds with an error explaining that location information is required.

---

### Retrieve Transaction History (Authenticated Endpoint)

**Positive Cases:**

- **Given** a logged-in user requests their transaction history,  
  **When** the system processes the request,  
  **Then** it returns a list of their past transactions ordered by date.

**Negative Cases:**

- **Given** the user is not authenticated,  
  **When** they request transaction history,  
  **Then** the system denies access and returns an authentication error.

---

### User Logout

**Positive Cases:**

- **Given** a logged-in user requests to logout,  
  **When** the request is handled,  
  **Then** the system invalidates their session or token and confirms logout.

**Negative Cases:**

- **Given** a user tries to logout without being logged in,  
  **When** the logout request is sent,  
  **Then** the system returns an error indicating the user is not authenticated.


To run all tests:

```bash
npm run test:e2e  
```

To generate coverage report:

```bash
npm run test:cov
```

## Code Therapy Sessions

Our code still has room to improve just as human experience,
so come back since even software deserves a little tough love!