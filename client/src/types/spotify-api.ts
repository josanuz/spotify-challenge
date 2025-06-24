// this provides sevreal TypeScript interfaces for the Spotify API, including search results, podcast details, audiobook details, user profiles, and more.
// for further details, refer to the Spotify API documentation.

// https://developer.spotify.com/documentation/web-api/reference/
export interface SpotifySearchResult<T> {
    href: string;
    limit: number;
    next: string;
    offset: number;
    total: number;
    items: T[];
}

export interface SpotifyPodcast {
    available_markets: string[];
    description: string;
    html_description?: string;
    explicit: boolean;
    href: string;
    id: string;
    images: Image[];
    is_externally_hosted: boolean;
    languages: string[];
    media_type: string;
    name: string;
    publisher: string;
    type: string;
    uri: string;
    total_episodes: number;
}

export interface SpotifyAudiobook {
    id: string;
    name: string;
    authors: Array<{ name: string }>;
    narrators: Array<{ name: string }>;
    publisher: string;
    description: string;
    total_chapters: number;
    images: Array<{ url: string; height: number; width: number }>;
    release_date: string;
}

export interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    scope?: string;
}

export interface SpotifyUserProfile {
    country: string;
    display_name: string;
    email: string;
    explicit_content: {
        filter_enabled: boolean;
        filter_locked: boolean;
    };

    followers: { href: string; total: number };
    href: string;
    id: string;
    images: Image[];
    product: string;
    type: string;
    uri: string;
}

export interface Image {
    url: string;
    height: number;
    width: number;
}
export interface SpotifyShow {
    name: string;
    publisher: string;
    images: { url: string }[];
}
export interface LibraryItem {
    user_id: number;
    library_name: string;
    podcast_id: string;
    podcast_info?: SpotifyShow;
} // Interface representing a user profile in spotify API
export interface UserProfile {
    country: string;
    display_name: string;
    email: string;
    explicit_content: {
        filter_enabled: boolean;
        filter_locked: boolean;
    };

    followers: { href: string; total: number };
    href: string;
    id: string;
    images: Image[];
    product: string;
    type: string;
    uri: string;
}
