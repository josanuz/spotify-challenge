import { Router } from 'express';
import { extracSpotifyTokenFromRequest } from '../util';
import { searchAudiobooks, searchPodcasts } from '../services/spotify-search-service';

const router = Router();

router.get('/podcasts', (req, res) => {
    const spotifyToken = extracSpotifyTokenFromRequest(req);
    const query = req.query.query as string;

    searchPodcasts(spotifyToken, query)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            console.error('Error searching audiobooks:', error);
            res.status(500).send('Internal Server Error: ');
        });
});

router.get('/audiobooks', (req, res) => {
    const spotifyToken = extracSpotifyTokenFromRequest(req);
    const query = req.query.query as string;

    searchAudiobooks(spotifyToken, query)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            console.error('Error searching audiobooks:', error);
            res.status(500).send('Internal Server Error: ');
        });
});

export default router;
