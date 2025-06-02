// List of Imports
import { Request, Response, NextFunction } from 'express';

/**
 * Error Handler
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: err.message || 'Unauthorized' });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
}
