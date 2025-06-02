import type { SpotifyPodcast } from '../types/spotify-api';

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
