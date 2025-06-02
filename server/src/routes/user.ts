import { Router } from 'express';
import { loadUserProfile } from '../services/user-service';
import {
    decodeToken,
    extractTokenFromCookie,
    extractTokenFromHeader,
} from '../services/authentication-service';
import { extracSpotifyTokenFromRequest } from '../util';
import { request } from 'http';

const router = Router();

router.get('/whoami', (req, res, next) => {
    try {
        const spotifyToken = extracSpotifyTokenFromRequest(req);
        loadUserProfile(spotifyToken)
            .then(user => {
                res.status(200).json(user);
            })
            .catch(error => {
                next(error);
            });
    } catch (error: any) {
        console.error('Error in /whoami:', error);
        res.status(400).send("Malformed request: " + error?.message || 'Unknown error');
    }
});

export default router;
