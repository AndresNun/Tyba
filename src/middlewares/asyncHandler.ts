// List of Imports
import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Asyn functions
 */
export function wrapAsync(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

/**
 * Instance Wrapper
 */
export function wrapHandlerInstance(instance: any, methodName: string): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(instance[methodName](req, res, next)).catch(next);
  };
}
