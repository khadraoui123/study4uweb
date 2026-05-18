import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.errors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Handle Prisma Database Connection Failures cleanly for UX
  if (
    err.message?.includes("Can't reach database server") ||
    (err as any).code === 'P1001' ||
    (err as any).code === 'P1002' ||
    err.message?.includes('database') && err.message?.includes('connection')
  ) {
    return res.status(503).json({
      success: false,
      error: "Database Connection Error: Unable to connect to PostgreSQL at localhost:5432. Please ensure your PostgreSQL service is started.",
    });
  }

  console.error('Unexpected error:', err);
  return res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
}
