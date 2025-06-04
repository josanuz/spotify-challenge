import type { UserProfile } from '../types/user-profile';
import api from './axios-clent';

export const fetchUserProfile = async (): Promise<UserProfile> => {
    return await api.get('/api/user/whoami').then(response => response.data as UserProfile);
};
