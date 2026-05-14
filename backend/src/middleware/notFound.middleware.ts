import { Request, Response } from 'express';

/**
 * 404 Not Found Handler Middleware
 * Handles all requests that don't match any defined routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route not found: ${req.method} ${req.path}`,
  });
};
