import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { getToken } from '../api/auth';
import { useQuery } from '@tanstack/react-query';
import { authenticationStore, setAuthentication } from '../state/app-state';

export const LoginInProgress = () => {
    const navigate = useNavigate();
    const [urlSearchParams] = useSearchParams();
    const code = useMemo(() => urlSearchParams.get('code'), [urlSearchParams]); // Memoize the code extraction to avoid unnecessary re-renders

    const tokenQuery = useQuery({
        queryKey: ['getToken', code],
        queryFn: () => getToken(code!),
        enabled: !!code, // Only run the query if code is available
        retry: false, // Disable automatic retries
        throwOnError: true, // Throw an error if the query fails
    });

    useEffect(() => {
        if (tokenQuery.isSuccess) {
            const response = tokenQuery.data;
            if (response.token) {
                authenticationStore.dispatch(setAuthentication(response.token));
                localStorage.setItem('jwtToken', response.token);
                navigate('/', { replace: true });
            } else {
                navigate(`/login?error=${encodeURIComponent(response.error || 'Unknown error')}`, {
                    replace: true,
                });
            }
        }
    }, [tokenQuery.isSuccess, tokenQuery.data, navigate]);

    return (
        <div className="flex items-center justify-center h-screen flex-col text-center">
            <h1 className="text-4xl font-bold">Logging in...</h1>
            <p className="mt-4 text-lg">Please wait while we log you in with Spotify.</p>
        </div>
    );
};
