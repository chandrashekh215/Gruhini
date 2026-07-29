import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.routes.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import { startGrpcServer } from './grpc/product.server.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup matching Spring Security config
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://gruhini-app1.onrender.com',
  'https://gruhani-app.onrender.com',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['*'],
    credentials: false,
  })
);

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
  console.log(`🌐 Express REST Server running on http://localhost:${PORT}`);
  startGrpcServer(Number(process.env.GRPC_PORT) || 50051);
});

export default app;
