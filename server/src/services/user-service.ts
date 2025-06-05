// Provides service functions to deal with local users
import axios from 'axios';
import { getConnection } from '../data/connection';
import { AppError, UnauthorizedError } from '../types/error';
import { LocalUser } from '../types/local-user';
import { SpotifyUserProfile } from '../types/spotify-api';
import { isOkCode } from '../util';

/**
 * Searchs for a local user that matches a given spotify id
 * @param spotifyId the spotify id to search for
 * @returns a promise that resolves to the local user information
 */
export const searchLocalUserByExtrenalId = async (spotifyId: string): Promise<LocalUser | null> => {
    const connection = await getConnection();

    const result = await connection.query<LocalUser[]>(
        'SELECT * FROM users WHERE spotify_id = ?',
        [spotifyId],
    );

    if (result.length > 0) {
        return result[0];
    }
    connection.release();
    return null;
};

/**
 * Creates a new local user using the info provided by Spotify
 * @param user The Spotify user to use as base
 * @param refreshToken the spotify refresh token
 * @returns the newly created spotify user
 */
export const createLocalUser = async (
    user: SpotifyUserProfile,
    refreshToken: string,
): Promise<LocalUser> => {
    const connection = await getConnection();

    const result = await connection
        .query<
            LocalUser[]
        >('INSERT INTO users (spotify_id, user_name, image_url, refresh_token) VALUES (?, ?, ?, ?) RETURNING *', [user.id, user.display_name, user.images[0]?.url ?? '', refreshToken])
        .finally(() => connection.release());

    return result[0] as LocalUser;
};

/**
 * When there is a new refresh token, updates it
 * @param spotify_id the id to search for
 * @param refreshToken the new token
 * @returns the local user with the updated fields
 */
export const updateLocalUserRefreshToken = async (
    spotify_id: string,
    refreshToken: string,
): Promise<LocalUser | null> => {
    const connection = await getConnection();
    const result = await connection
        .query<
            LocalUser[]
        >('UPDATE users SET refresh_token = ? WHERE spotify_id = ? RETURNING *', [refreshToken, spotify_id])
        .finally(() => connection.release());

    return result && result[0];
};

/**
 * Loads an user from Spotify
 * @param accessToken acess token to authenticate
 * @returns a promise that resolves to the spotify user
 */
export const loadUserProfile = async (accessToken: string): Promise<SpotifyUserProfile> => {
    const response = await axios
        .get<SpotifyUserProfile>('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .catch(error => {
            throw new UnauthorizedError(`Failed to fetch user profile`, error);
        });

    if (response == null || !isOkCode(response.status)) {
        throw new AppError(response.statusText, response.status);
    }

    return response.data;
};
