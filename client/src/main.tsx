import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import App from './App.tsx';
import { LoginInSpotify } from './route-components/log-in-spotify.tsx';
import { Home } from './route-components/home.tsx';
import {
    atom,
    injectAtomValue,
    injectPromise,
    createStore,
    injectStore,
    actionFactory,
    createReducer,
    injectEffect,
} from '@zedux/react';
import { LoginInProgress } from './route-components/login-in-progress.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fetchUserProfile } from './api/user.ts';
import PodcastDialog from './route-components/detailed-view-dialog.tsx';
import PodcastLibraryGrid from './route-components/library-view.tsx';
import { isTokenAboutToExpire, refreshToken } from './api/auth.ts';

export const setAuthentication = actionFactory<string>('setAuthentication');
export const removeAuthentication = actionFactory('removeAuthentication');

const reducer = createReducer({ token: localStorage.getItem('jwtToken') || null })
    .reduce(setAuthentication, (_, token) => ({ token }))
    .reduce(removeAuthentication, () => ({ token: null }));

export const authenticationStore = createStore(reducer);

authenticationStore.subscribe(() => {
    const state = authenticationStore.getState();
    if (state.token) {
        localStorage.setItem('jwtToken', state.token);
    } else {
        localStorage.removeItem('jwtToken');
    }
});

export const authenticationAtom = atom('authentication', () => {
    const authStore = injectStore(() => authenticationStore);
    const { token } = authStore.getState();

    injectEffect(() => {
        console.log('Authentication store initialized with token:', token);
        if (authStore.getState().token) {
            const intervalId = setInterval(() => {
                if (isTokenAboutToExpire(token)) {
                    refreshToken()
                        .then(newToken => {
                            if (newToken.token) {
                                authStore.dispatch(setAuthentication(newToken.token));
                            } else {
                                authStore.dispatch(removeAuthentication());
                            }
                        })
                        .catch(() => {
                            authStore.dispatch(removeAuthentication());
                        });
                }
            }, 30000); // Check every 30 seconds
            return () => clearInterval(intervalId);
        }
    }, [token]);

    return authStore;
});

// export const jwtTokenAtom = atom('jwtToken', () => localStorage.getItem('jwtToken'));
// export const currentUserAtom = atom<UserProfile | null>('currentUser', null);

export const userProfileAtom = atom('userProfile', () => {
    const { token } = injectAtomValue(authenticationAtom);
    const currentUserApi = injectPromise(
        () => (token != null ? fetchUserProfile() : Promise.resolve(null)),
        [token],
        { dataOnly: true, subscribe: false },
    );

    return currentUserApi;
});

const querClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={querClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to={'/libmanager'} />} />
                    <Route path="/login" element={<LoginInSpotify />} />
                    <Route path="/code-landing" element={<LoginInProgress />} />
                    <Route path="/libmanager" element={<App />}>
                        <Route index element={<Navigate to="home" />} />
                        <Route path="home" element={<Home />}>
                            <Route path=":id" element={<PodcastDialog />} />
                        </Route>
                        <Route path="library" element={<PodcastLibraryGrid />} />
                        {/* <Route path="profile" element={<div>Profile Page</div>} /> */}
                        <Route path="*" element={<div>404 Not Found</div>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>,
);
