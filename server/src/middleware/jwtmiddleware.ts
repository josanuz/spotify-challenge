import { RequestHandler } from 'express';
import {
    extractTokenFromCookie,
    extractTokenFromHeader,
    isTokenAboutToExpire,
    verifyToken,
} from '../services/authentication-service';

import Enviroment from '../config/enviroment';

export const JWTMiddleware = (excludePaths?: string[]) => {
    const handler: RequestHandler = (req, res, next) => {
        const { path, headers } = req;

        // Check if the request path is in the exclude list
        if (excludePaths?.includes(path)) {
            return next();
        }

        // Check for JWT in headers
        const token =
            extractTokenFromHeader(headers.authorization) ?? extractTokenFromCookie(req.cookies);

        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Verify the JWT
        const decoded = verifyToken(token);
        // If verification fails, send an error response
        if (!decoded.valid) {
            res.status(401).json({ error: 'Invalid token', details: decoded.error });
        } else {
            // If the token is about to expire, refresh it
            if (isTokenAboutToExpire(decoded.payload)) {
                res.cookie('session-token', token, {
                    secure: Enviroment.MODE == 'production', // Use secure cookies in production
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                    sameSite: 'strict',
                });
            }

            next(); // Proceed to the next middleware or route handler
        }
    };

    return handler;
};
