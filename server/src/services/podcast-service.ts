/* 
    this fiel provides the service functions for managing a user's personal podcast library.
    It includes functions to get the personal library, add a podcast to the library,
    and remove a podcast from the library.
*/
import { PoolConnection } from 'mariadb';
import { getConnection } from '../data/connection';
import { AppError, InternalServerError } from '../types/error';
import { LibraryItem, LibraryItemResult } from '../types/library';
import { SpotifyPodcastResult } from '../types/spotify-api';
import { console } from 'inspector';

/**
 * Fetches the personal podcast library of a user from the database and enriches it with podcast details from Spotify.
 * @param userId the ID of the user whose library is being fetched
 * @param spotifyToken the Spotify access token for authentication
 * @returns A promise that resolves to an array of LibraryItemResult objects,
 */
export const getPersonalLibrary = async (userId: number, spotifyToken: string) => {
    const query = `
        SELECT user_id, library_name, podcast_id
        FROM podcast_library
        WHERE user_id = ?
        ORDER BY library_name, podcast_id
    `;

    let connection: PoolConnection | null = null;
    try {
        connection = await getConnection();
        const data = await connection.query<LibraryItem[]>(query, [userId]);
        
        if (!data || data.length < 1) {
            return [];
        }

        const ids = data.map(item => item.podcast_id).join(',');
        const podcastDetails = await fetch(`https://api.spotify.com/v1/shows?ids=${ids}`, {
            headers: {
                Authorization: `Bearer ${spotifyToken}`,
            },
        });

        if (!podcastDetails.ok) {
            throw new AppError(podcastDetails.statusText, podcastDetails.status);
        }
        const podcastData = await podcastDetails.json();
        const podcasts: SpotifyPodcastResult[] = podcastData.shows || [];
        const enrichedLibrary: LibraryItemResult[] = data.map(item => {
            const podcastInfo = podcasts.find(p => p.id === item.podcast_id);
            return {
                ...item,
                podcast_info: podcastInfo,
            };
        });

        return enrichedLibrary;
    } finally {
        connection?.release();
    }
};

/**
 *
 * @param userId the ID of the user adding the podcast to their library
 * @param podcastId the ID of the podcast to be added
 * @param libraryName name for the library where the podcast is being added to
 * @returns true if the podcas was added
 */
export const addToLibrary = async (userId: number, podcastId: string, libraryName: string) => {
    const connection = await getConnection();
    const query =
        ' INSERT INTO podcast_library (user_id, library_name, podcast_id) VALUES (?, ?, ?)';

    const result = await connection.query(query, [userId, libraryName, podcastId]).catch(err => {
        throw new InternalServerError('Database query error', err);
    });

    console.log(result)

    connection.release();

    return result != null;
};

/**
 *
 * @param userId the ID of the user adding the podcast to their library
 * @param podcastId the ID of the podcast to be added
 * @param libraryName name for the library where the podcast is being added to
 * @returns true if the podcas was removed
 */
export const removeFromLibrary = async (userId: number, podcastId: string, libraryName: string) => {
    const connection = await getConnection();
    const query = `
        DELETE FROM podcast_library
        WHERE user_id = ? AND podcast_id = ? AND library_name = ?
    `;

    const result = await connection
        .query(query, [userId, podcastId, libraryName])
        .catch(err => {
            throw new InternalServerError('Database query error', err);
        })
        .finally(() => connection.release());

    console.log(result);
    return result != null;
};
