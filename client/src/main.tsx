import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import App from './App.tsx';
import { LoginInSpotify } from './route-components/log-in-spotify.tsx';
import { Home } from './route-components/home.tsx';
import { atom, injectAtomValue, injectPromise } from '@zedux/react';
import type { UserProfile } from './types/user-profile.ts';
import { LoginInProgress } from './route-components/login-in-progress.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fetchUserProfile } from './api/user.ts';
import PodcastDialog from './route-components/detailed-view-dialog.tsx';
import PodcastLibraryGrid from './route-components/library-view.tsx';

export const jwtTokenAtom = atom('jwtToken', () => localStorage.getItem('jwtToken'));
export const currentUserAtom = atom<UserProfile | null>('currentUser', null);

export const userProfileAtom = atom('userProfile', () => {
    const jwtToken = injectAtomValue(jwtTokenAtom);
    console.log('Fetching user profile with JWT token:', jwtToken);
    const currentUserApi = injectPromise(
        () => (jwtToken != null ? fetchUserProfile(jwtToken) : Promise.resolve(null)),
        [jwtToken],
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
