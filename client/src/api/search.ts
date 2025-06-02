import axios from 'axios';
import type { SpotifyAudiobook, SpotifyPodcast, SpotifySearchResult } from '../types/spotify-api';

export interface SearchParams {
    query: string;
    token: string;
    page?: number;
    pageSize?: number;
}

export async function searchAudioBooks(
    params: SearchParams,
): Promise<SpotifySearchResult<SpotifyAudiobook>> {
    const response = await axios.get('/api/search/audiobooks', {
        params,
        headers: { Authorization: `Bearer ${params.token}` },
    });
    return response.data;
}

export async function searchPodcasts(
    params: SearchParams,
): Promise<SpotifySearchResult<SpotifyPodcast>> {
    const response = await axios.get<SpotifySearchResult<SpotifyPodcast>>('/api/search/podcasts', {
        params,
        headers: { Authorization: `Bearer ${params.token}` },
    });
    return response.data;
}
