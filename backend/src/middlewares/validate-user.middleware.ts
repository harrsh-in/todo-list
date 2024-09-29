import { NextFunction, Request, Response } from 'express';
import { nodeEnv } from '../env';

const getUserIdentityMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let userId = req.cookies['userId'];

    if (!userId) {
        userId = require('crypto').randomUUID();
        res.cookie('userId', userId, {
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: nodeEnv === 'production',
            sameSite: 'strict',
        });
        req.cookies['userId'] = userId;
    }

    next();
};

export default getUserIdentityMiddleware;
