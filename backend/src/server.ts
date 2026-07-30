import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.routes.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import { startGrpcServer } from './grpc/product.server.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Universal CORS Middleware for production & local environments
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  })
);

app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'UP', message: 'Gruhini Express Backend Running' });
});

// Mount Routes
app.use('/', apiRouter);

// Global Error Middleware
app.use(globalErrorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🌐 Express REST Server running on port ${PORT}`);
  startGrpcServer(Number(process.env.GRPC_PORT) || 50051);
});

export default app;
