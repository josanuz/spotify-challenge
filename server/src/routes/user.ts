// this file deals with fetching user profile information
import { Router } from 'express';
import { loadUserProfile } from '../services/user-service';
import { extracSpotifyTokenFromRequest } from '../util';

const router = Router();

/**
 * Fetches the user's profile information from Spotify.
 * This route is used to get the current user's profile details.
 */
router.get('/whoami', (req, res, next) => {
    const spotifyToken = extracSpotifyTokenFromRequest(req);
    loadUserProfile(spotifyToken)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(error => {
            next(error);
        });
});

export default router;
