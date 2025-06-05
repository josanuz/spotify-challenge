import { Request } from 'express';
import {
    decodeToken,
    extractTokenFromCookie,
    extractTokenFromHeader,
} from './services/authentication-service';
import { UnauthorizedError } from './types/error';

export const isOkCode = (status: number): boolean => {
    return status >= 200 && status < 300;
};

/**
 * Extracts the spotify token from the JWT claims, this method does no verify the JWT signature
 * @param req Express request object
 * @returns the spotify token stored in the JWT claims
 */
export const extracSpotifyTokenFromRequest = (req: Request): string => {
    const token = decodeJWTfromRequest(req);
    if (!token) {
        throw new UnauthorizedError('Unauthorized: No token provided');
    }
    return token.third_party_access_token;
};

/**
 * Decodes the JWT from request, does not validates the signing
 * @param req Express request
 * @returns
 */
export const decodeJWTfromRequest = (req: Request) => {
    const token =
        extractTokenFromHeader(req.headers.authorization) || extractTokenFromCookie(req.cookies);
    if (!token) return null;
    return decodeToken(token);
};
