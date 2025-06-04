// this file deals with fetching podcasts from Spotify
import { Router } from 'express';
import { extracSpotifyTokenFromRequest } from '../util';
import { getPodcast } from '../services/spotify-search-service';

const router = Router();

/**
 * Fetches a podcast by its ID.
 * @param {string} id - The ID of the podcast to fetch.
 */
router.get('/:id', (req, res) => {
    try {
        const spotifyToken = extracSpotifyTokenFromRequest(req);
        const podcastId = req.params.id;
        getPodcast(spotifyToken, podcastId)
            .then(podcast => res.status(200).json(podcast))
            .catch(error => {
                console.error('Error fetching podcast:', error);
                res.status(500).send('Internal Server Error: ' + error.message);
            });
    } catch (error) {
        console.error('Error extracting Spotify token:', error);
        res.status(401).send('could not authenticate user');
    }
});

export default router;
