import './env';
import express from 'express';
import cors from 'cors';
import { config } from './config';

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

app.get('/', (req, res) => {
  res.json({
    service: config.SERVICE_NAME,
    version: config.API.VERSION,
    status: 'running',
  });
});

export default app;
