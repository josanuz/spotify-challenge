import jwt, { JwtPayload } from 'jsonwebtoken';
import Environment from '../config/enviroment';
import { AuthenticationInfo } from '../types/authentication-info';
import { SpotifyTokenResponse, SpotifyUserProfile } from '../types/spotify-api';
import { UnauthorizedError } from '../types/error';

const JWT_SECRET = Environment.JWT_SECRET;
const JWT_EXPIRATION = '45m'; // Token expiration time
const JWT_ISSUER = 'audiobooks-app'; // Issuer of the token
const JWT_AUDIENCE = 'audiobooks-app-users'; // Audience for the token

type SuccesfulVerification = {
    valid: true;
    payload: AuthenticationInfo;
};

type FailedVerification = {
    valid: false;
    error: string;
};

export type VerificationResult = SuccesfulVerification | FailedVerification;

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

export function decodeToken(token: string): AuthenticationInfo | null {
    try {
        const decoded = jwt.decode(token);
        return decoded as AuthenticationInfo; // Return the decoded payload without verification
    } catch (error) {
        console.error('Token decoding failed:', error);
        throw new UnauthorizedError('Invalid token format');
    }
}

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

export function extractTokenFromCookie(
    cookies: { [key: string]: string } | undefined,
): string | null {
    if (!cookies || !cookies['session-token']) {
        return null;
    }

    return cookies['session-token']; // Return the token from the cookie
}

export function isTokenAboutToExpire(payload: JwtPayload): boolean {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    if (!payload.exp) return false; // If no expiration time, return false
    const timeLeft = payload.exp - currentTime; // Time left in seconds

    return timeLeft < 300; // Return true if less than 5 minutes left
}
