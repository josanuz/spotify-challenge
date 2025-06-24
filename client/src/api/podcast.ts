/**
 *  This file contains functions to interact with the podcast API.
 *  It includes functions to get podcast details, manage the library, and add or remove podcasts from the library.
 */
import type { LibraryItem, SpotifyPodcast } from '../types/spotify-api';
import api from './axios-client';

/**
 * Fetches a podcast by its ID.
 * @param podcastId - The ID of the podcast to fetch.
 * @returns A promise that resolves to the SpotifyPodcast object.
 */
export const getPodcast = async (podcastId: string): Promise<SpotifyPodcast> => {
    return await api.get(`/api/podcast/${podcastId}`).then(res => res.data as SpotifyPodcast);
};

/**
 * Fetches the user's podcast library.
 * @returns A promise that resolves to an array of LibraryItem objects representing the user's podcast library.
 */
export const getLibrary = async (): Promise<LibraryItem[]> => {
    return await api
        .get('/api/lib/podcast')
        .then(response => response.data as LibraryItem[])
        .catch(error => {
            throw new Error(`Error fetching library: ${error.message}`);
        });
};

/**
 * Removes a podcast from the user's library.
 * @param podcastId - The ID of the podcast to remove from the library.
 * @returns  A promise that resolves to an object indicating success or failure.
 */
export const removeFromLibrary = async (
    podcastId: string,
): Promise<{ success: boolean; error?: string }> => {
    // Todo manage multiple libraries
    return await api
        .delete(`/api/lib/podcast/default/${podcastId}`)
        .then(() => ({ success: true }))
        .catch(error => ({ success: false, error: error.message }));
};

/**
 * Adds a podcast to the user's library.
 * @param podcastId - The ID of the podcast to add to the library.
 * @returns A promise that resolves to an object indicating success or failure.
 */
export const addToLibrary = async (
    podcastId: string,
): Promise<{ success: boolean; error?: string }> => {
    return await api
        .post(`/api/lib/podcast/default/${podcastId}`)
        .then(res => ({ success: res.status === 200 }))
        .catch(error => ({ success: false, error: error.message }));
};
