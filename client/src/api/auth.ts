/**
 * Call to the authentication API to get a token or refresh it.
 */
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import api from './axios-client';

/**
 * Response type for the token request.
 */
export type TokenResponse = {
    token?: string;
    message?: string;
    error?: string;
};

/**
 * Checks if the provided JWT token is about to expire within the next 60 seconds.
 * @param token - The JWT token to check.
 * @returns true if the token is about to expire within the next 60 seconds, false otherwise.
 */
export const isTokenAboutToExpire = (token: string | null): boolean => {
    if (!token) return false;
    const { exp } = jwtDecode<{ exp: number }>(token);
    const now = Math.floor(Date.now() / 1000);
    return exp - now < 60; // 60 seconds before expiration
};

/**
 * Exchanges an access token for a JWT token.
 * @param accessToken - The access token to exchange for a JWT token.
 * @returns A promise that resolves to a TokenResponse containing the JWT token or an error message.
 */
export const getToken = async (accessToken: string): Promise<TokenResponse> => {
    return axios
        .post('/auth/code-begin', { code: accessToken })
        .then(response => {
            if (response.status === 200) {
                return response.data as TokenResponse;
            } else {
                return { error: `Authentication failed ${response.statusText}` };
            }
        })
        .catch(error => {
            return { error: `Error reaching the server: ${error.message}` };
        });
};

/**
 * refreshes the JWT token by making a request to the authentication API.
 * @returns A promise that resolves to a TokenResponse containing a new JWT token or an error message.
 */
export const refreshToken = async (): Promise<TokenResponse> => {
    return api.post('/auth/refresh-token').then(response => response.data as TokenResponse);
};
