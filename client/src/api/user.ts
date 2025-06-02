import type { UserProfile } from '../types/user-profile';

export const fetchUserProfile = async (accessToken: string): Promise<UserProfile> => {
    const response = await fetch('/api/user/whoami', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching user profile: ${response.statusText}`);
    }

    return response.json() as Promise<UserProfile>;
};
