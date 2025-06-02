import axios from 'axios';
import { getConnection } from '../data/connection';
import { LocalUser } from '../types/local-user';
import { isOkCode } from '../util';
import { SpotifyUserProfile } from '../types/spotify-api';

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

    const result = await connection.query(
        'INSERT INTO users (spotify_id, user_name, image_url, refresh_token) VALUES ($1, $2, $3, $4) RETURNING *',
        [user.id, user.display_name, user.images[0]?.url ?? '', refreshToken],
    );

    connection.release();
    return result.rows[0] as LocalUser;
};

export const updateLocalUserRefreshToken = async (
    spotify_id: string,
    refreshToken: string,
): Promise<LocalUser | null> => {
    const connection = await getConnection();
    const result = await connection.query(
        'UPDATE users SET refresh_token = $1 WHERE spotify_id = $2 RETURNING *',
        [refreshToken, spotify_id],
    );
    connection.release();
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
            console.error('Error fetching user profile:', error);
            return null;
        });

    if (response == null || !isOkCode(response.status)) {
        throw new Error(`Error fetching user profile: ${response?.statusText}`);
    }

    return response.data;
};
// "BQCac7J78_dd8N06Ye3wp13DD5euu8_7LKgKgbVgFwvA3tYp2PwkJffM6VF5vc6frZ8cP19z2_462o7oXVf--Q55GHHa_XiluzqOjVsTDFe_tnyi1Fz4UJRSCfiygMJAOt4o1cQ5wp3DviQloW2HJivO24GEtTnI3FQdHSfSG82iZb3OPMzGN4ETJ-OVEY6JtHyBdwrtZ0DJjxc77RFswYp-it2Jrd0X4eIYhA"
