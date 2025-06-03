import axios from 'axios';
import { getConnection } from '../data/connection';
import { LocalUser } from '../types/local-user';
import { isOkCode } from '../util';
import { SpotifyUserProfile } from '../types/spotify-api';
import { AppError, UnauthorizedError } from '../types/error';

export const searchLocalUserByExtrenalId = async (spotifyId: string): Promise<LocalUser | null> => {
    const connection = await getConnection();

    const result = await connection.query('SELECT * FROM users WHERE spotify_id = $1', [spotifyId]);

    if (result.rows.length > 0) {
        return result.rows[0] as LocalUser;
    }
    connection.release();
    return null;
};

export const createLocalUser = async (
    user: SpotifyUserProfile,
    refreshToken: string,
): Promise<LocalUser> => {
    const connection = await getConnection();

    const result = await connection
        .query(
            'INSERT INTO users (spotify_id, user_name, image_url, refresh_token) VALUES ($1, $2, $3, $4) RETURNING *',
            [user.id, user.display_name, user.images[0]?.url ?? '', refreshToken],
        )
        .finally(() => connection.release());

    return result.rows[0] as LocalUser;
};

export const updateLocalUserRefreshToken = async (
    spotify_id: string,
    refreshToken: string,
): Promise<LocalUser | null> => {
    const connection = await getConnection();
    const result = await connection
        .query('UPDATE users SET refresh_token = $1 WHERE spotify_id = $2 RETURNING *', [
            refreshToken,
            spotify_id,
        ])
        .finally(() => connection.release());

    return result.rows.length > 0 ? (result.rows[0] as LocalUser) : null;
};

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

