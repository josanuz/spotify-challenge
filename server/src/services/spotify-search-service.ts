import axios from 'axios';
import {
    SpotifyAudiobook,
    SpotifyAudiobookSearchResult,
    SpotifyPodcastResult,
} from '../types/spotify-api';

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

export async function getAudiobook(accessToken: string, audiobookId: string) {
    const response = await axios.get(`${SPOTIFY_API_BASE}/audiobooks/${audiobookId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data as SpotifyAudiobook;
}

export async function getAudiobookChapters(
    accessToken: string,
    audiobookId: string,
    limit: number = 20,
    offset: number = 0,
) {
    const response = await axios.get(`${SPOTIFY_API_BASE}/audiobooks/${audiobookId}/chapters`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        params: {
            limit,
            offset,
        },
    });
    return response.data.chapters;
}

export function searchPodcasts(
    accessToken: string,
    query: string,
    limit: number = 20,
    offset: number = 0,
): Promise<SpotifyPodcastResult> {
    return SearchSpotify(accessToken, query, 'show', limit, offset).then(data => data.shows);
}

export async function getPodcast(accessToken: string, podcastId: string) {
    const response = await axios.get(`${SPOTIFY_API_BASE}/shows/${podcastId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data as SpotifyPodcastResult;
}
