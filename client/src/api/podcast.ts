import type { SpotifyPodcast } from '../types/spotify-api';

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

export const getPodcast = async (token: string, podcastId: string): Promise<SpotifyPodcast> => {
    const response = await fetch(`/api/podcast/${podcastId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching podcast: ${response.statusText}`);
    }

    const podcastData = await response.json();
    return podcastData as SpotifyPodcast;
};

export const getLibrary = async (token: string): Promise<LibraryItem[]> => {
    const response = await fetch('/api/lib/podcast', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching library: ${response.statusText}`);
    }

    const libraryData = await response.json();
    return libraryData as LibraryItem[];
};

export const removeFromLibrary = async (token: string, podcastId: string): Promise<void> => {
    // Todo manage multiple libraries
    const response = await fetch(`/api/lib/podcast/default/${podcastId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error removing podcast from library: ${response.statusText}`);
    }
};

export const addToLibrary = async (token: string, podcastId: string): Promise<void> => {
    const response = await fetch(`/api/lib/podcast/default/${podcastId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error adding podcast to library: ${response.statusText}`);
    }
};
