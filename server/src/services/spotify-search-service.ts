// This file deals with audiobooks and podcast from the Spotify API
import axios from 'axios';
import {
    SpotifyAudiobook,
    SpotifyAudiobookSearchResult,
    SpotifyPodcastResult,
} from '../types/spotify-api';
import { UnauthorizedError } from '../types/error';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

async function SearchSpotify(
    accessToken: string,
    query: string,
    type: 'show' | 'audiobook',
    limit: number = 20,
    offset: number = 0,
) {
    const response = await axios.get(`${SPOTIFY_API_BASE}/search`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        params: {
            q: query,
            type: 'show',
            limit,
            offset,
        },
    });

    return response.data as {
        audiobooks: SpotifyAudiobookSearchResult;
        shows: SpotifyPodcastResult;
    };
}


/**
 * Searches for audiobooks on Spotify using the provided access token and query.
 *
 * @param accessToken - The Spotify access token used for authentication.
 * @param query - The search query string to find audiobooks.
 * @param limit - (Optional) The maximum number of results to return. Defaults to 20.
 * @param offset - (Optional) The index of the first result to return. Defaults to 0.
 * @returns A promise that resolves to a `SpotifyAudiobookSearchResult` containing the search results.
 */
export async function searchAudiobooks(
    accessToken: string,
    query: string,
    limit: number = 20,
    offset: number = 0,
): Promise<SpotifyAudiobookSearchResult> {
    return SearchSpotify(accessToken, query, 'audiobook', limit, offset).then(
        data => data.audiobooks,
    );
}
/**
 * Fetches details for a specific audiobook
 * @param accessToken Spotify accestoken
 * @param audiobookId Id for the audiobook
 * @returns 
 */
export async function getAudiobook(accessToken: string, audiobookId: string) {
    const response = await axios.get(`${SPOTIFY_API_BASE}/audiobooks/${audiobookId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data as SpotifyAudiobook;
}

/**
 * 
 * @param accessToken Spotify access token
 * @param query Query to pass down to the API
 * @param limit max amount of results
 * @param offset results starting from this point
 * @returns a Promise that resolves to SpotifyPodcastResult
 */
export function searchPodcasts(
    accessToken: string,
    query: string,
    limit: number = 20,
    offset: number = 0,
): Promise<SpotifyPodcastResult> {
    return SearchSpotify(accessToken, query, 'show', limit, offset).then(data => data.shows);
}

export async function getPodcast(accessToken: string, podcastId: string) {
    const response = await axios
        .get<SpotifyPodcastResult>(`${SPOTIFY_API_BASE}/shows/${podcastId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .catch(error => {
            throw new UnauthorizedError('Invalid access token', error as Error);
        });
    return response.data;
}
