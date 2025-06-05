// This file provides the state management for authentication and user profile in a React application using Zedux.
import {
    actionFactory,
    atom,
    createReducer,
    createStore,
    injectAtomValue,
    injectEffect,
    injectPromise,
    injectStore,
} from '@zedux/react';
import { isTokenAboutToExpire, refreshToken } from '../api/auth';
import { fetchUserProfile } from '../api/user';

/**
 * Action to set the authentication token.
 * @param {string} token - The JWT token to set.
 */
export const setAuthentication = actionFactory<string>('setAuthentication');
/**
 * Action to remove the authentication token.
 */
export const removeAuthentication = actionFactory('removeAuthentication');
/**
 * Reducer to manage authentication state.
 * It initializes with the token from localStorage or null if not present.
 * It handles setting the token when `setAuthentication` is dispatched,
 * and removing the token when `removeAuthentication` is dispatched.
 * The token is also stored in localStorage for persistence across sessions.
 */
const reducer = createReducer({ token: localStorage.getItem('jwtToken') || null })
    .reduce(setAuthentication, (_, token) => ({ token }))
    .reduce(removeAuthentication, () => ({ token: null }));

/**
 * create the authentication store using the reducer.
 * The store is responsible for managing the authentication state of the application.
 * It subscribes to changes in the state and updates localStorage accordingly.
 * When the token is set, it saves the token to localStorage.
 * When the token is removed, it clears the token from localStorage.
 * This ensures that the authentication state persists across page reloads.
 * The store is exported for use in the application.
 */
export const authenticationStore = createStore(reducer);
authenticationStore.subscribe(() => {
    const state = authenticationStore.getState();
    if (state.token) {
        localStorage.setItem('jwtToken', state.token);
    } else {
        localStorage.removeItem('jwtToken');
    }
});

/**
 * Atom for managing authentication state.
 * This atom provides access to the authentication store and initializes it.
 * It checks if the token is about to expire every 30 seconds and refreshes it if necessary.
 * If the token is refreshed successfully, it updates the authentication store with the new token.
 * If the refresh fails, it removes the authentication token from the store.
 * This ensures that the application maintains a valid authentication state.
 * The atom is exported for use in the application.
 */
export const authenticationAtom = atom('authentication', () => {
    const authStore = injectStore(() => authenticationStore);
    const { token } = authStore.getState();

    injectEffect(() => {
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

/**
 * Atom for managing the user profile.
 * This atom fetches the user profile from the API using the authentication token.
 * It uses the `injectPromise` function to handle the asynchronous fetching of the user profile.
 * If the token is not available, it resolves to null.
 * The user profile data is fetched only when the token is available, ensuring that the API call is made only when necessary.
 */
export const userProfileAtom = atom('userProfile', () => {
    const { token } = injectAtomValue(authenticationAtom);
    const currentUserApi = injectPromise(
        () => (token != null ? fetchUserProfile() : Promise.resolve(null)),
        [token],
        { dataOnly: true, subscribe: false },
    );

    return currentUserApi;
});
