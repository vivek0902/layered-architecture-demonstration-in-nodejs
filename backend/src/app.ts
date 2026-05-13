import './env';
import express from 'express';
import cors from 'cors';
import { config } from './config';
import apiRoutes from './routes/index.route';
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
export default app;
