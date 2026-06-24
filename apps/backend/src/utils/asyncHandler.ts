import type { NextFunction, Request, RequestHandler, Response } from "express";

export function asyncHanlder(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler {
  return function wrapper(req, res, next) {
    handler(req, res, next).catch(next);
  };
}
