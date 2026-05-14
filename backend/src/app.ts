import './env';
import express from 'express';
import cors from 'cors';
import { config } from './config';
import apiRoutes from './routes/index.route';
import { notFoundHandler } from './middleware/notFound.middleware';
import { errorHandler } from './middleware/errorHandler.middleware';

const app = express();

app.use(
  cors({
    origin: config.CORS.ORIGIN,
    credentials: config.CORS.CREDENTIALS,
    methods: config.CORS.METHODS,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/', (_, res) => {
  res.json({
    service: config.SERVICE_NAME,
    version: config.API.VERSION,
    status: 'running',
  });
});

app.use(config.API.PREFIX, apiRoutes);

// 404 Not Found handler
app.use(notFoundHandler);

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
