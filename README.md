# Tyba Backend Engineer Test

This repository contains the backend API developed as part of the technical challenge for the Backend Engineer position at Tyba.

---

## 📚 Table of Contents

* [Environment Setup](#environment-setup)

  * [Prerequisites](#prerequisites)
  * [Environment Variables](#environment-variables)
  * [Step 1: Start Services with Docker Compose (PostgreSQL & Redis)](#step-1-start-services-with-docker-compose-postgresql--redis)
  * [Step 2: Run the NestJS App Locally](#step-2-run-the-nestjs-app-locally)
* [Docker Compose Commands](#docker-compose-commands)
* [Useful NPM Scripts](#useful-npm-scripts)
* [Optional: Creating a New Migration](#optional-creating-a-new-migration)
* [Architecture](#architecture)
* [API Documentation](#api-documentation)
* [Postman Collection](#postman-collection)
* [Testing](#testing)
* [Linting](#linting)
* [Deployment](#deployment)

---

## Environment Setup

### Prerequisites

* [Docker](https://www.docker.com/)
* [Node.js](https://nodejs.org/) (version >= 16)
* Environment files:

  * `.env.development`
  * `.env.production`

### Environment Variables

Two `.env` files are used depending on the environment:

* `.env.development` — for local development
* `.env.production` — for production or staging deployment

Example environment variables:

```env
# Vars
PORT=8000
API_PREFIX='/api/v1'
JWT_SECRET=super-secret-token
GOOGLE_PLACES_API_KEY=TU_API
BLACKLIST_DURATION_SECONDS=3600

# Database variables: Postgre SQL
DB_HOST=postgres
DB_PORT=5432
DB_POSTGRES=tyba_db
DB_USERNAME=tyba_dummy
DB_PASSWORD=tyba_secret

# Database variables: Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=tyba_secret_2
REDIS_DB=0
REDIS_PREFIX=api:


# Enviroments
NODE_ENV=development
```

---

## Step 1: Start App with Docker Compose (PostgreSQL & Redis)

To build and start the application and its services (Redis, PostgreSQL):

```bash
npm run docker:start
```
To stop and remove the containers:

```bash
npm run docker:down
```

After the Starte of the App the system will use the .env.development variables and
will be available in the: http://localhost:PORT.

---

## 🔧 Docker Compose Commands

| Command               | Description                                           |
| --------------------- | ----------------------------------------------------- |
| `npm run docker:dev`  | Build and run all services using `docker-compose.yml` |
| `npm run docker:down` | Stop and remove all running containers                |
---

## 🏗️ Architecture

The application is structuredwith the following monolitic arquitecture:

* **Common** to state enums and global variables to use
* **Config** configurations of the database, Auth JWT, Google-API, Jest, Swagger
* **Controllers** to handle HTTP requests
* **Dtos** to handle validations
* **Services** to encapsulate business logic
* **Repositories** for database access using TypeORM
* **Redis** for caching and throttling
* **PostgreSQL** as the main database

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

---

## 📖 API Documentation



```
http://localhost:8000/docs
```

---

## 🔁 Postman Collection

You can import the Postman collection file to test all the endpoints manually.


Steps:

1. Open Postman
2. Click `Import`
3. Select the file `postman_collection.json`
4. Use the environment variables for base URL and tokens if needed

---

## 🧪 Testing

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
npm run test
```

To run in watch mode:

```bash
npm run test:watch
```

To generate coverage report:

```bash
npm run test:cov
```
