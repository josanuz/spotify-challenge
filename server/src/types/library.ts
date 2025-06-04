import { SpotifyPodcastResult } from './spotify-api';

export interface LibraryItem {
    user_id: number;
    library_name: string;
    podcast_id: string;
}

export interface LibraryItemResult extends LibraryItem {
    podcast_info?: SpotifyPodcastResult;
}
