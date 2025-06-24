// classes related to spotify requests and responses, see spotify developer docs for more info
export interface SpotifyPodcastResult {
    available_markets: string[];
    description: string;
    html_description: string;
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

export interface SpotifyAudiobookSearchResult {
    href: string;
    items: SpotifyAudiobook[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
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
