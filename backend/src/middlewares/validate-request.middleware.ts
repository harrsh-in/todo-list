import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';

const validateRequestMiddleware = (schemas: {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!schemas.body && !schemas.params && !schemas.query) {
                throw new Error('No schema provided for validation.');
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
        } catch (error) {
            if (error instanceof ZodError) {
                console.error(JSON.stringify(error, null, 2));
                throw new Error(error.errors[0].message);
            }

            next(error);
        }
    };
};

export default validateRequestMiddleware;
