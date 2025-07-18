/**
 * this file provides the routes for managing podcast libraries
 * it includes endpoints for fetching the user's podcast library,
 * adding podcasts to the library, and removing podcasts from the library.
 */
import { Router } from 'express';
import {
    addToLibrary,
    getPersonalLibrary,
    removeFromLibrary,
} from '../../services/podcast-service';
import { fetchLocalUser } from '../../services/user-service';
import { decodeJWTfromRequest, extracSpotifyTokenFromRequest } from '../../util';

const router = Router();

/**
 * Fetches the user's podcast library.
 */
router.get('/', async (req, res) => {
    const token = decodeJWTfromRequest(req);
    const spotifyCode = extracSpotifyTokenFromRequest(req);
    const localUser = await fetchLocalUser(token!.localuser_id);

    if (!localUser) {
        res.status(404).send('User not found');
        return;
    }

    const libraryItems = await getPersonalLibrary(localUser.id, spotifyCode);
    res.status(200).json(libraryItems);
});

/**
 * Adds a podcast to the user's library.
 */
router.post('/:libraryName/:id', async (req, res) => {
    const token = decodeJWTfromRequest(req);
    const localUser = await fetchLocalUser(token!.localuser_id);
    const { id: podcastId, libraryName } = req.params;

    if (!libraryName || !podcastId) {
        res.status(400).send('Missing required parameters: libraryName or podcastId');
        return;
    }

    addToLibrary(localUser!.id, podcastId, libraryName).then(success => {
        if (success) {
            res.status(200).send('Podcast added to library');
        } else {
            res.status(400).send('Could not add podcast to library');
        }
    });
});
/**
 * Removes a podcast from the user's library.
 */
router.delete('/:libraryName/:id', async (req, res) => {
    const token = decodeJWTfromRequest(req);
    const localUser = await fetchLocalUser(token!.localuser_id);
    const { libraryName, id: podcastId } = req.params;

    if (!libraryName || !podcastId) {
        res.status(400).send('Missing required parameters: libraryName or podcastId');
        return;
    }

    removeFromLibrary(localUser!.id, podcastId, libraryName).then(success => {
        if (success) {
            res.status(200).send('Podcast added to library');
        } else {
            res.status(400).send('Failed to add podcast to library');
        }
    });
});

export default router;
