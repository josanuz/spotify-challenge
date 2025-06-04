import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import App from './App.tsx';
import './index.css';
import PodcastDialog from './route-components/detailed-view-dialog.tsx';
import { Home } from './route-components/home.tsx';
import PodcastLibraryGrid from './route-components/library-view.tsx';
import { LoginInSpotify } from './route-components/log-in-spotify.tsx';
import { LoginInProgress } from './route-components/login-in-progress.tsx';

const querClient = new QueryClient();

/**
 * Creates the root of the React application and renders the main component.
 * It sets up the React Router for navigation and the QueryClientProvider for data fetching.
 * The application includes routes for the home page, library, login page, and a fallback for 404 errors.
 * The main application component is wrapped in a StrictMode to help identify potential problems in the application.
 * The QueryClientProvider is used to provide the query client to the entire application, enabling data fetching capabilities.
 */
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
