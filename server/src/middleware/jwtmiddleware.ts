import { RequestHandler } from 'express';
import {
    extractTokenFromCookie,
    extractTokenFromHeader,
    verifyToken,
} from '../services/authentication-service';
import { UnauthorizedError } from '../types/error';

/**
 * Middleware to handle JWT authentication.
 * It checks for a valid JWT in the request headers or cookies.
 * If the token is missing or invalid, it throws an UnauthorizedError.
 *
 * @param excludePaths - Optional array of paths to exclude from JWT verification.
 * @returns Express middleware function.
 */
export const JWTMiddleware = (excludePaths?: string[]) => {
    const handler: RequestHandler = (req, res, next) => {
        const { path, headers } = req;

        // Check if the request path is in the exclude list
        if (excludePaths?.includes(path)) {
            return next();
        }

        // Check for JWT in headers or cookies
        const token =
            extractTokenFromHeader(headers.authorization) ?? extractTokenFromCookie(req.cookies);

        if (!token) {
            throw new UnauthorizedError('No token provided');
        }

        // Verify the JWT
        const decoded = verifyToken(token);
        // If verification fails, send an error response
        if (!decoded.valid) {
            throw new UnauthorizedError('Invalid token');
        } else {
            next(); // Proceed to the next middleware or route handler
        }
    };

    return handler;
};
