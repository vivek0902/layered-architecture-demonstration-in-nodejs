import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export interface AppError extends Error {
  statusCode?: number;
}

/**
 * Global Error Handler Middleware
 * Handles all errors thrown in the application
 * Must be defined last in the middleware stack
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const isDevelopment = config.NODE_ENV === 'development';

  // Log errors
  if (isDevelopment) {
    console.error('Error:', {
      statusCode,
      message,
      stack: err.stack,
    });
  } else {
    // In production, log only essential info
    console.error(`[${new Date().toISOString()}] Error: ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(isDevelopment && { stack: err.stack }),
  });
};
