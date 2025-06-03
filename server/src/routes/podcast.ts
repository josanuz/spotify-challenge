import { Router } from 'express';
import { extracSpotifyTokenFromRequest } from '../util';
import { getPodcast } from '../services/spotify-search-service';
import { addToLibrary, removeFromLibrary } from '../services/podcast-service';
import { loadUserProfile, searchLocalUserByExtrenalId } from '../services/user-service';

const router = Router();

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
