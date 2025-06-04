/**
 * This file contains function related to the user profile.
 * It includes a function to fetch the current user's profile information.
 */
import type { UserProfile } from '../types/spotify-api';
import api from './axios-clent';

/**
 * Fetches the current user's profile information.
 * @returns A promise that resolves to the UserProfile object containing the user's profile information.
 */
export const fetchUserProfile = async (): Promise<UserProfile> => {
    return await api.get('/api/user/whoami').then(response => response.data as UserProfile);
};
