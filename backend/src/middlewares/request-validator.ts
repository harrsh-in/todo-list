import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

const validateRequestMiddleware = (schemas: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!schemas.body && !schemas.params && !schemas.query) {
        throw new Error("No schema provided for validation.");
      }

      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      next();
    } catch (e) {
      console.error(JSON.stringify(e, null, 2));

      if (e instanceof ZodError) {
        throw new Error(e.errors[0].message);
      }

      next(e);
    }
  };
};

export default validateRequestMiddleware;
