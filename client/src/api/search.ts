import type { SpotifyAudiobook, SpotifyPodcast, SpotifySearchResult } from '../types/spotify-api';
import api from './axios-clent';

export interface SearchParams {
    query: string;
    page?: number;
    pageSize?: number;
}

export async function searchAudioBooks(
    params: SearchParams,
): Promise<SpotifySearchResult<SpotifyAudiobook>> {
    const response = await api.get('/api/search/audiobooks', { params });
    return response.data;
}

export async function searchPodcasts(
    params: SearchParams,
): Promise<SpotifySearchResult<SpotifyPodcast>> {
    const response = await api.get<SpotifySearchResult<SpotifyPodcast>>('/api/search/podcasts', {
        params,
    });
    return response.data;
}
