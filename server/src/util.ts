import { Request } from "express";
import { extractTokenFromCookie, extractTokenFromHeader, verifyToken } from "./services/authentication-service";

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
        throw new Error(`Unauthorized: ${verification.error}`);
    }
    const { third_party_access_token } = verification.payload;
    return third_party_access_token;
}