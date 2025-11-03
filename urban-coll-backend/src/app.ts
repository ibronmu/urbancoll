import express from 'express';
import { json, urlencoded } from 'body-parser';
import { createServer } from 'http';
import { initRoutes } from './routes/index';
import { errorHandler } from './middlewares/error.middleware';
import { connectToDatabase } from './config/index';

const app = express();
const server = createServer(app);

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Connect to Database
connectToDatabase();

// Initialize Routes
initRoutes(app);

// Error Handling Middleware
app.use(errorHandler);

export default server;