import { Request } from 'express';
import {
    extractTokenFromCookie,
    extractTokenFromHeader,
    verifyToken,
} from './services/authentication-service';
import { UnauthorizedError } from './types/error';

export const isOkCode = (status: number): boolean => {
    return status >= 200 && status < 300;
};

export const extracSpotifyTokenFromRequest = (req: Request): string => {
    const token =
        extractTokenFromHeader(req.headers.authorization) || extractTokenFromCookie(req.cookies);
    if (!token) {
        throw new Error('Unauthorized: No token provided');
    }

    const verification = verifyToken(token);
    if (!verification.valid) {
        throw new UnauthorizedError();
    }

    const { third_party_access_token } = verification.payload;
    return third_party_access_token;
};
