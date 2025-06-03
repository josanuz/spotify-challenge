import axios, { AxiosRequestConfig } from 'axios';
import { Router, Request, Response } from 'express';
import queryString from 'query-string';
import { v4 } from 'uuid';
import Environment from '../config/enviroment';
import {
    extractTokenFromCookie,
    extractTokenFromHeader,
    generateToken,
    verifyToken,
} from '../services/authentication-service';
import {
    createLocalUser,
    loadUserProfile,
    searchLocalUserByExtrenalId,
    updateLocalUserRefreshToken,
} from '../services/user-service';
import { extracSpotifyTokenFromRequest, isOkCode } from '../util';
import { SpotifyTokenResponse } from '../types/spotify-api';
import { console } from 'inspector';

// const queryString = await import('query-string').then(module => module.default);

const { CLIENT_ID, REDIRECT_URI, CLIENT_SECRET } = Environment;
const authorizationUrl = 'https://accounts.spotify.com/authorize?';
const tokenUrl = 'https://accounts.spotify.com/api/token';

const router = Router();

router.get('/login', function (req, res) {
    const state = v4().substring(0, 16);
    const scope = 'user-read-private user-read-email';

    res.redirect(
        authorizationUrl +
            queryString.stringify({
                response_type: 'code',
                client_id: CLIENT_ID,
                scope: scope,
                redirect_uri: REDIRECT_URI,
                state: state,
            }),
    );
});

router.post('/code-begin', function (req, res) {
    const { code } = req.body;
    if (!code) {
        res.status(401).json({
            error: 'Code is required',
        });
        return;
    }

    const requestBody = {
        code: code.toString(),
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
    };

    const requestOptions: AxiosRequestConfig<typeof requestBody> = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization:
                'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
        },
    };

    axios
        .post<SpotifyTokenResponse>(tokenUrl, requestBody, requestOptions)
        .then(async response => {
            const spotifyResponse = response.data;

            if (!spotifyResponse.access_token || !spotifyResponse.refresh_token) {
                res.status(401).redirect(
                    req.headers.referer +
                        '?' +
                        queryString.stringify({ error: 'Invalid response from Spotify' }),
                );
                return;
            }
            // Load the user profile from Spotify using the access token
            const externalUser = await loadUserProfile(spotifyResponse.access_token);
            if (externalUser != null) {
                // Check if the user already exists in the local database
                const localUser = await searchLocalUserByExtrenalId(externalUser.id);
                if (!localUser) {
                    await createLocalUser(externalUser, spotifyResponse.refresh_token);
                }
                // Generate a JWT token for the user
                const token = generateToken(externalUser, spotifyResponse);

                res.status(200).json({
                    message: 'Authentication successful',
                    token: token,
                });
            } else {
                res.status(401).json({
                    error: 'Could not load user profile from Spotify',
                });
                return;
            }
        })
        .catch(error => {
            console.error('Error during authentication with Spotify:', error);
            res.status(400).json({
                error: 'Error during authentication with Spotify',
                details: error.message,
            });
        });
});

router.get('/callback', function (req, res) {
    const code = req.query.code || null;
    const state = req.query.state || null;

    const redirectUrl = req.headers.referer || '/';

    if (state === null || code === null) {
        res.redirect(
            redirectUrl +
                '?' +
                queryString.stringify({
                    error: 'could not complete authentication',
                }),
        );
        return;
    }

    res.redirect(
        redirectUrl +
            'code-landing/?' +
            queryString.stringify({
                code: code,
            }),
    );
});

router.post('/refresh-token', async (req: Request, res: Response) => {
    try {
        const spotifyToken = extracSpotifyTokenFromRequest(req);
        const spotifyUser = await loadUserProfile(spotifyToken);
        const localUser = await searchLocalUserByExtrenalId(spotifyUser.id);
        if (!localUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const requestBody = new URLSearchParams();
        requestBody.append('grant_type', 'refresh_token');
        requestBody.append('refresh_token', localUser.refresh_token);

        const requestOptions: AxiosRequestConfig<typeof requestBody> = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization:
                    'Basic ' +
                    Buffer.from(Environment.CLIENT_ID + ':' + Environment.CLIENT_SECRET).toString(
                        'base64',
                    ),
            },
        };

        axios
            .post(tokenUrl, requestBody, requestOptions)
            .then(response => {
                if (isOkCode(response.status)) {
                    const sptf_response = response.data as SpotifyTokenResponse;
                    const newToken = generateToken(spotifyUser, sptf_response);
                    res.status(200).json({
                        message: 'Token refreshed successfully',
                        token: newToken,
                    });
                    if (sptf_response.refresh_token)
                        updateLocalUserRefreshToken(
                            localUser.spotify_id,
                            sptf_response.refresh_token,
                        );
                }
            })
            .catch(error => {
                console.error('Error refreshing token:', error);
                res.status(401).json({ error: 'Error refreshing token' });
            });
    } catch (error) {
        console.error('Error in /refresh-token:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
});

export default router;
