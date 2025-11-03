# UrbanColl Marketplace

UrbanColl is a functional e-commerce marketplace designed to connect vendors and customers in Nigeria. This project aims to provide a seamless shopping experience with essential features for both vendors and customers.

## Project Structure

The project is organized into several directories and files, each serving a specific purpose:

- **src/**: Contains the source code for the application.
  - **controllers/**: Manages the business logic for different entities (auth, vendor, product, order, payment, admin).
  - **routes/**: Defines the API routes for the application.
  - **services/**: Contains the business logic for handling requests and interacting with repositories.
  - **repositories/**: Handles database operations for different entities.
  - **models/**: Defines the data models used in the application.
  - **middlewares/**: Contains middleware functions for authentication, error handling, and validation.
  - **utils/**: Provides utility functions for various tasks, including Paystack integration and logging.
  - **jobs/**: Contains background jobs for handling tasks like webhooks.
  - **types/**: Defines TypeScript types and interfaces used throughout the application.
  
- **prisma/**: Contains the database schema and migration files for Prisma.
  
- **scripts/**: Includes scripts for seeding the database with initial data.
  
- **tests/**: Contains unit and integration tests for the application.
  
- **docker/**: Contains Docker configuration files for containerizing the application.

## Setup Instructions

1. **Clone the Repository**
   ```
   git clone <repository-url>
   cd urban-coll-backend
   ```

2. **Install Dependencies**
   ```
   npm install
   ```

3. **Configure Environment Variables**
   Copy the `.env.example` file to `.env` and update the values as needed.

4. **Run Database Migrations**
   ```
   npx prisma migrate dev
   ```

5. **Seed the Database (Optional)**
   ```
   npx ts-node scripts/seed.ts
   ```

6. **Start the Application**
   ```
   npm run start
   ```

## Features

- User authentication (login and registration)
- Vendor management (add, update, retrieve vendor information)
- Product management (add, update, retrieve products)
- Order processing (create and retrieve orders)
- Payment processing through Paystack
- Admin controls for managing users and vendors

## Testing

To run the tests, use the following command:
```
npm run test
```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.