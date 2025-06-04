import type { SpotifyPodcast } from '../types/spotify-api';
import api from './axios-clent';

// TODO move to a location where it makes more sense

export interface SpotifyShow {
    name: string;
    publisher: string;
    images: { url: string }[];
    external_urls: { spotify: string };
}

export interface LibraryItem {
    user_id: number;
    library_name: string;
    podcast_id: string;
    podcast_info?: SpotifyShow;
}

export const getPodcast = async (podcastId: string): Promise<SpotifyPodcast> => {
    return await api.get(`/api/podcast/${podcastId}`).then(res => res.data as SpotifyPodcast);
};

export const getLibrary = async (): Promise<LibraryItem[]> => {
    return await api
        .get('/api/lib/podcast')
        .then(response => response.data as LibraryItem[])
        .catch(error => {
            throw new Error(`Error fetching library: ${error.message}`);
        });
};

export const removeFromLibrary = async (
    podcastId: string,
): Promise<{ success: boolean; error?: string }> => {
    // Todo manage multiple libraries
    return await api
        .delete(`/api/lib/podcast/default/${podcastId}`)
        .then(() => ({ success: true }))
        .catch(error => ({ success: false, error: error.message }));
};

export const addToLibrary = async (
    podcastId: string,
): Promise<{ success: boolean; error?: string }> => {
    return await api
        .post(`/api/lib/podcast/default/${podcastId}`)
        .then(res => ({ success: res.status === 200 }))
        .catch(error => ({ success: false, error: error.message }));
};
