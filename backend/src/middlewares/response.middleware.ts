import { Request, Response, NextFunction } from 'express';

const successHandlerMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.success = (data: any, message = '', statusCode = 200) => {
        res.status(statusCode).json({
            status: 'success',
            message,
            data,
        });
    };
    next();
};

export default successHandlerMiddleware;

declare global {
    namespace Express {
        interface Response {
            success: (data: any, message?: string, statusCode?: number) => void;
        }
    }
}
