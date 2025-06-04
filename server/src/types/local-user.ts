/** User for local transactions */
export interface LocalUser {
    /** Autoincremental id */
    id: number;
    /** Spotify account associated to this user */
    spotify_id: string;
    /** user name (gotten from spotify) */
    user_name: string;
    /** user image url )hosted on spotify) */
    image_url: string;
    /** Refresh token in case of session expiration */
    refresh_token: string;
}
