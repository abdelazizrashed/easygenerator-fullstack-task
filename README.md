# Full Stack Authentication Task (NestJS + React)

This project implements a user authentication module (Sign Up, Sign In) using a microservice architecture with NestJS for the backend and React for the frontend.

## Project Structure (Monorepo)

This repository uses a monorepo structure managed by `pnpm` workspaces.

```
│
├── apps/
│   ├── api-gateway/    # NestJS App: Handles HTTP requests, basic validation, calls downstream services. Exposes API.
│   ├── auth-service/     # NestJS Microservice: Handles authentication logic, JWT generation/validation.
│   ├── user-service/     # NestJS Microservice: Handles user CRUD operations, MongoDB interaction.
│   └── frontend/         # React SPA: User interface (Vite, Redux Toolkit, Tailwind, Shadcn/ui).
└── libs/
    └── common/           # Shared NestJS Library: Constants, DTO interfaces, helpers, filters etc.
```


## Technologies Used

* **Monorepo Tooling:** PNPM Workspaces, NestJS CLI
* **Backend Framework:** NestJS
* **Backend Language:** TypeScript
* **Microservice Communication:** TCP (Configurable via Env Vars)
* **Database:** MongoDB (using MongoDB Atlas)
* **ODM (User Service):** Mongoose (`@nestjs/mongoose`)
* **Authentication:** JWT (`@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`), Bcryptjs (Password Hashing)
* **Configuration:** `@nestjs/config`, `.env` files
* **API Documentation:** `@nestjs/swagger`, Swagger UI
* **Validation:** `class-validator`, `class-transformer`
* **Frontend Framework:** React
* **Frontend Language:** TypeScript
* **Frontend Bundler:** Vite
* **Frontend State Management:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
* **Frontend UI/Styling:** Tailwind CSS + Shadcn/ui
* **Frontend Form Handling:** React Hook Form + Zod (for validation)
* **Frontend API Client:** Axios
* **Linting/Formatting:** ESLint, Prettier

## Installation

**Prerequisites:**

* Node.js (v18 or later recommended)
* PNPM (v8 or later recommended: `npm install -g pnpm`)
* Access to a MongoDB instance (MongoDB Atlas free tier is sufficient - see Configuration below)
* Git

**Steps:**

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd easygen-fullstack-task
    ```
2.  **Install dependencies:**
    Run pnpm install from the root directory. This will install dependencies for all apps and libraries and link local packages.
    ```bash
    pnpm install
    ```

## Environment Variables Configuration

This project uses `.env` files for environment-specific configuration. **Crucially, `.env` files should NOT be committed to Git.** Add them to your root `.gitignore` file.

You need to create the following `.env` files based on the examples below:

1.  **`apps/api-gateway/.env`**
    ```ini
    # Port the API Gateway listens on
    PORT=3000

    # Connection details for Auth Service (where API Gateway CONNECTS)
    AUTH_SERVICE_TRANSPORT=TCP
    AUTH_SERVICE_HOST=localhost # Or internal host in deployment
    AUTH_SERVICE_PORT=3002

    # Connection details for User Service (where API Gateway CONNECTS)
    USER_SERVICE_TRANSPORT=TCP
    USER_SERVICE_HOST=localhost # Or internal host in deployment
    USER_SERVICE_PORT=3001

    # JWT Secret (MUST MATCH auth-service)
    JWT_SECRET=THIS_IS_A_VERY_SECRET_KEY_REPLACE_ME_32_CHARS_OR_MORE
    ```

2.  **`apps/auth-service/.env`**
    ```ini
    # Listener Config for THIS Auth Service
    AUTH_SERVICE_LISTEN_TRANSPORT=TCP
    AUTH_SERVICE_LISTEN_HOST=0.0.0.0 # Listen on all interfaces
    AUTH_SERVICE_LISTEN_PORT=3002

    # JWT Configuration
    JWT_SECRET=THIS_IS_A_VERY_SECRET_KEY_REPLACE_ME_32_CHARS_OR_MORE # MUST MATCH api-gateway
    JWT_EXPIRATION_TIME=1h # e.g., 15m, 7d

    # Client Config for User Service (How Auth Service CONNECTS to User Service)
    USER_SERVICE_TRANSPORT=TCP
    USER_SERVICE_HOST=localhost # Or internal host in deployment
    USER_SERVICE_PORT=3001
    ```

3.  **`apps/user-service/.env`**
    ```ini
    # Listener Config for THIS User Service
    USER_SERVICE_LISTEN_TRANSPORT=TCP
    USER_SERVICE_LISTEN_HOST=0.0.0.0 # Listen on all interfaces
    USER_SERVICE_LISTEN_PORT=3001

    # MongoDB Connection String
    # Replace with your actual MongoDB Atlas SRV string or local URI
    USER_SERVICE_MONGO_URI=mongodb+srv://<username>:<password>@<your-cluster-uri>/user_service_db?retryWrites=true&w=majority

    # Bcrypt Salt Rounds
    BCRYPT_SALT_ROUNDS=10
    ```

4.  **`apps/frontend/.env`**
    ```ini
    # Base URL for the API Gateway the frontend connects to
    VITE_API_BASE_URL=http://localhost:3000
    ```

**Note on MongoDB Atlas:** You need to create a cluster, database user, and allow network access (allow `0.0.0.0/0` for local dev only, restrict IPs for production) on [MongoDB Atlas](https://cloud.mongodb.com/). Replace `<username>`, `<password>`, and `<your-cluster-uri>` in the `USER_SERVICE_MONGO_URI`. Ensure the database name (e.g., `user_service_db`) is specified in the URI.

## Running the Application (Development)

You need to run each backend service and the frontend application simultaneously in separate terminals. All commands should be run from the **root of the monorepo**.

1.  **Start User Service:**
    ```bash
    pnpm run start:dev user-service
    ```
    *(Default listener: TCP on port 3001)*

2.  **Start Auth Service:**
    ```bash
    pnpm run start:dev auth-service
    ```
    *(Default listener: TCP on port 3002)*

3.  **Start API Gateway:**
    ```bash
    pnpm run start:dev api-gateway
    ```
    *(Default HTTP server: http://localhost:3000)*

4.  **Start Frontend:**
    ```bash
    # Option 1: Using pnpm filter
    pnpm run dev --filter frontend

    # Option 2: Navigate and run
    # cd apps/frontend
    # pnpm run dev
    ```
    *(Default Vite server: http://localhost:5173 - check terminal output)*

**Accessing the App:**

* Frontend UI: `http://localhost:5173` (or as specified by Vite)
* API Gateway Base: `http://localhost:3000`
* API Documentation (Swagger): `http://localhost:3000/docs`

## API Documentation

Interactive API documentation is generated using Swagger UI and is available at the `/docs` endpoint of the running API Gateway (e.g., `http://localhost:3000/docs`).

## TODO / Future Improvements

This implementation provides the core functionality but can be improved, especially regarding security and production readiness:

-   [ ] **Rate Limiting:** Implement rate limiting on the API Gateway (especially auth endpoints) using `@nestjs/throttler` to prevent brute-force and DoS attacks.
-   [ ] **Frontend JWT Storage:** Replace `localStorage` for JWT storage with a more secure method (e.g., in-memory storage with HttpOnly refresh token cookies) to mitigate XSS risks.
-   [ ] **Security Headers:** Add standard security headers to the API Gateway using `helmet`.
-   [ ] **CORS Configuration:** Configure CORS more strictly in the API Gateway for production environments (specify allowed origins).
-   [ ] **Token Invalidation:** Implement server-side token invalidation (e.g., a blacklist using Redis) if immediate logout or session revocation is required (helps mitigate token replay if compromised before expiry).
-   [ ] **Refine DTOs:** Move validation and Swagger decorators from shared DTOs (`@app/common`) into service-specific DTOs (primarily in `api-gateway`) using shared interfaces for the data contract. Create custom DTOs per specific request/response for more precise validation and documentation.
-   [ ] **Logging:** Implement structured, contextual logging (e.g., add request/trace IDs) and remove/scrub any logs that might leak sensitive data in production. Integrate with a central logging platform.
-   [ ] **TSDocs:** Add comprehensive TSDoc comments to services, controllers, DTOs, and complex functions for better code documentation.
-   [ ] **Testing:** Add comprehensive unit, integration, and e2e tests for all services and the frontend.
-   [ ] **Secrets Management:** Implement a proper secrets management solution for production environments (e.g., Vault, AWS Secrets Manager, K8s Secrets).
-   [ ] **Internal Auth:** Secure communication between microservices (e.g., using mutual TLS, API keys, or a more advanced service mesh pattern).
