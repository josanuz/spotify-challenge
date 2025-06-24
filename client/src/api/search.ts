/**
 * This file contains function related to searching for audiobooks and podcasts on Spotify.
 * It includes functions to search for audiobooks and podcasts based on a query, with optional pagination.
 */
import type { SpotifyAudiobook, SpotifyPodcast, SpotifySearchResult } from '../types/spotify-api';
import api from './axios-client';

/**
 * Interface for search parameters.
 * @property query - The search query string.
 * @property page - The page number for pagination (optional).
 * @property pageSize - The number of results per page (optional).
 */
export interface SearchParams {
    query: string;
    page?: number;
    pageSize?: number;
}

/**
 * Searches for audiobooks on Spotify based on the provided parameters.
 * @param params - The search parameters including the query, page, and pageSize.
 * @returns  A promise that resolves to a SpotifySearchResult containing an array of SpotifyAudiobook objects.
 */
export async function searchAudioBooks(
    params: SearchParams,
): Promise<SpotifySearchResult<SpotifyAudiobook>> {
    const response = await api.get('/api/search/audiobooks', { params });
    return response.data;
}

/**
 * Searches for podcasts on Spotify based on the provided parameters.
 * @param params - The search parameters including the query, page, and pageSize.
 * @returns A promise that resolves to a SpotifySearchResult containing an array of SpotifyPodcast objects.
 */
export async function searchPodcasts(
    params: SearchParams,
): Promise<SpotifySearchResult<SpotifyPodcast>> {
    const response = await api.get<SpotifySearchResult<SpotifyPodcast>>('/api/search/podcasts', {
        params,
    });
    return response.data;
}
