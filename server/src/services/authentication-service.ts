// this file provides authentication services, including token generation, verification, and extraction from headers or cookies.
import jwt from 'jsonwebtoken';
import Environment from '../config/enviroment';
import { AuthenticationInfo } from '../types/authentication-info';
import { UnauthorizedError } from '../types/error';
import { SpotifyTokenResponse, SpotifyUserProfile } from '../types/spotify-api';

const JWT_SECRET = Environment.JWT_SECRET;
const JWT_ISSUER = 'audiobooks-app'; // Issuer of the token
const JWT_AUDIENCE = 'audiobooks-app-users'; // Audience for the token

/**
 * Represents the response payload for successful authentication.
 */
type SuccesfulVerification = {
    /** true for all succesfull authentications  */
    valid: true;
    /** The decoded payload containing user information and access token */
    payload: AuthenticationInfo;
};

/** Represents the response for a failed authentication attempt  */
type FailedVerification = {
    /** false for all failed authentications */
    valid: false;
    /** Error message describing the failure reason */
    error: string;
};

/** ADT for verification results  */
export type VerificationResult = SuccesfulVerification | FailedVerification;

/**
 * Generates a JWT token for the authenticated user.
 * @param user - The Spotify user profile containing user information.
 * @param token - The Spotify token response containing access token and expiration.
 * @returns A signed JWT token.
 */
export function generateToken(user: SpotifyUserProfile, token: SpotifyTokenResponse): string {
    const payload: AuthenticationInfo = {
        sub: user.id, // Subject: user ID
        name: user.display_name, // Custom claim
        email: user.email, // Custom claim
        third_party_access_token: token.access_token, // Custom claim for third-party access token
    };

    const options: jwt.SignOptions = {
        expiresIn: token.expires_in - 60, // Use the expires_in from the token response
        audience: JWT_AUDIENCE,
        issuer: JWT_ISSUER,
    };

    return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verifies a JWT token and returns the decoded payload if valid.
 * @param token - The JWT token to verify.
 * @returns VerificationResult - An object indicating whether the token is valid or not.
 */
export function verifyToken(token: string): VerificationResult {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            audience: JWT_AUDIENCE,
            issuer: JWT_ISSUER,
        }) as AuthenticationInfo;
        return {
            valid: true,
            payload: decoded, // Return the decoded payload if verification is successful
        };
    } catch (error) {
        return {
            valid: false,
            error: (error as Error).message || 'Token verification failed',
        };
    }
}

/**
 * Decodes a JWT token without verifying its signature.
 * @param token - The JWT token to decode.
 * @returns AuthenticationInfo | null - The decoded payload if successful, or null if decoding fails.
 */
export function decodeToken(token: string): AuthenticationInfo | null {
    try {
        const decoded = jwt.decode(token);
        return decoded as AuthenticationInfo; // Return the decoded payload without verification
    } catch (error) {
        console.error('Token decoding failed:', error);
        throw new UnauthorizedError('Invalid token format');
    }
}

/**
 * Extracts the token from the Authorization header.
 * @param authorizationHeader - The Authorization header string.
 * @returns The extracted token or null if not found or invalid format.
 */
export function extractTokenFromHeader(authorizationHeader: string | undefined): string | null {
    if (!authorizationHeader) {
        return null;
    }

    const parts = authorizationHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }

    return parts[1]; // Return the token part
}

/**
 * Extracts the token from cookies.
 * @param cookies - An object containing cookies.
 * @returns The extracted token or null if not found.
 */
export function extractTokenFromCookie(
    cookies: { [key: string]: string } | undefined,
): string | null {
    if (!cookies || !cookies['session-token']) {
        return null;
    }

    return cookies['session-token']; // Return the token from the cookie
}

