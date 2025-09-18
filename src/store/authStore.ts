import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { login as apiLogin, register as apiRegister, getMe, refreshToken, logout as apiLogout } from '@services/authService';
import log from '@utils/logger';
import { getErrorMessage } from '@mtypes/error';


/**
 * Represents a user in the authentication system.
 *
 * This is a minimal user shape stored in the auth store. Add additional
 * fields (email, roles, avatarUrl, etc.) as needed to reflect API responses.
 */
interface User {
    id: number;
    username: string;
    // Add other user fields as needed
}

/**
 * The shape of the authentication store state and the available actions.
 *
 * This interface describes both the persisted state (user, token) and the
 * runtime state (loading, error) as well as the actions that operate on the
 * authentication state (login, register, refresh, logout, and setters).
 */
interface AuthState {

    /**
     * The currently authenticated user from the auth store.
     *
     * This value will be the user object when a session exists, or null/undefined
     * when no user is authenticated. Consumers should check for truthiness before
     * accessing user properties.
     */
    user: User | null;

    /**
     * The JWT access token for the current session.
     *
     * This token is used for authenticating API requests. It will be null when
     * no user is logged in. Consumers should check for truthiness before using
     * the token.
     */
    token: string | null;

    /**
     * True while an authentication-related operation is in progress.
     *
     * Examples include login, register, and refreshToken flows.
     */
    loading: boolean;

    /**
     * Human readable error message from the last failed auth operation, if any.
     *
     * Null when there is no error. Use clearError to reset this field.
     */
    error: string | null;

    /**
     * Attempt to authenticate using username and password.
     *
     * On success the store's user and token are set and persisted.
     *
     * @param username - The username for authentication.
     * @param password - The password for authentication.
     * @returns Promise resolving to true when login succeeds, false otherwise.
     */
    login: (username: string, password: string) => Promise<boolean>;

    /**
     * Register a new user account.
     *
     * This calls the backend registration endpoint and returns a boolean
     * indicating success. It does not automatically log the user in.
     *
     * @param username - Desired username.
     * @param password - Desired password.
     * @returns Promise resolving to true when registration succeeds, false otherwise.
     */
    register: (username: string, password: string) => Promise<boolean>;

    /**
     * Refresh the access token and update the stored user/token.
     *
     * Typically used to prolong a session without requiring the user to re-enter credentials.
     * @returns Promise that resolves once the refresh flow completes.
     */
    refreshToken: () => Promise<void>;

    /**
     * Clear authentication state and remove any stored tokens.
     *
     * Use to log the user out locally.
     */
    logout: () => void;

    /**
     * Clear the current error message.
     */
    clearError: () => void;

    /**
     * Manually set the loading state.
     * @param loading - Whether an operation is in progress.
     */
    setLoading: (loading: boolean) => void;

    /**
     * Manually set the token in state (does not persist unless persistence is triggered).
     * @param token - New access token or null to clear.
     */
    setToken: (token: string | null) => void;

    /**
     * Manually set the current user in state.
     * @param user - User object or null to clear.
     */
    setUser: (user: User | null) => void;
}


/**
 * Hook providing access to the authentication Zustand store.
 *
 * The hook returns state and actions for authentication (user, token,
 * loading, error, login, register, refreshToken, logout, etc.). The store
 * is persisted under the 'auth-storage' key so user and token survive page reloads.
 *
 * Usage:
 * const { user, login, logout } = useAuthStore();
 *
 * @returns A Zustand hook with AuthState (state + actions).
 */
export const useAuthStore = create<AuthState>()(

    /**
     * Persist middleware to save user and token to localStorage.
     * 
     * How persist works:
     * - The first argument is a function that receives `set` and `get` methods to update and access state.
     * - The second argument is a config object for persistence options.
     * 
     * In this case, we persist the `user` and `token` fields under the key 'auth-storage'.
     *
     * See https://zustand.docs.pmnd.rs/integrations/persisting-store-data#simple-examples for details.
     * 
     * Note: We do not persist `loading` or `error` as they are runtime states.
     * 
     * The `partialize` option allows us to specify which parts of the state to persist.
     * Here we only persist `user` and `token`.
     */
    persist(
        /**
         * Set default state and define actions to manipulate auth state.
         *  
         * @param set - Function to update the store state.
         * @returns 
         */
        (set) => ({
            user: null,
            token: null,
            loading: false,
            error: null,

            /**
             * Login Sequence:
             *   1. Set loading state to true and clear previous errors.
             *   2. Call the login API with provided credentials.
             *   3. On success, store the returned token and fetch user details.
             *   4. Update the store with user and token, set loading to false.
             *   5. Persist the token in localStorage.
             *   6. On failure, set an error message, clear user/token, and log the error.
             *   7. Return true on success, false on failure.
             * 
             *   Note: We catch all errors and provide a generic message to avoid leaking sensitive info.
             * 
             */
            login: async (username: string, password: string) => {
                set({ loading: true, error: null });
                try {
                    await apiLogin({ username, password });
                    const userData = await getMe();
                    set({
                        user: userData,
                        token: 'cookie-based', // Placeholder since token is now in httpOnly cookie
                        loading: false,
                        error: null
                    });
                    return true;
                } catch (e: unknown) {
                    // Show a friendly message for login failures
                    let message = 'Login failed. Try again.';
                    // Optionally, you can check for specific error types here
                    set({
                        error: message,
                        loading: false,
                        user: null,
                        token: null
                    });
                    log.error('Login failed', e);
                    return false;
                }
            },

            /**
             * 
             * Registration Sequence:
             *   1. Set loading state to true and clear previous errors.
             *   2. Call the registration API with provided username and password.
             *   3. On success, set loading to false and clear errors.
             *   4. Return true to indicate successful registration.
             *   5. On failure, set an error message, set loading to false, and log the error.
             *   6. Return false to indicate registration failure.
             * 
             * Note: Registration does not log the user in automatically.
             * The user must call login separately after registering.
             * 
             */
            register: async (username: string, password: string) => {
                set({ loading: true, error: null });
                try {
                    await apiRegister({ username, password });
                    set({ loading: false, error: null });
                    return true;
                } catch (e: unknown) {
                    set({ error: getErrorMessage(e, 'Registration failed'), loading: false });
                    return false;
                }
            },

            /**
             * Token Refresh Sequence:
             *   1. Set loading state to true and clear previous errors.
             *   2. Call the refreshToken API to obtain a new access token.
             *   3. On success, fetch the current user details using the new token.
             *   4. Update the store with the new user and token, set loading to false.
             *   5. Persist the new token in localStorage.
             *   6. On failure, set an error message, clear user/token, and log the error.
             * 
             * Note: This function does not return a value. Consumers should check
             * the store's user/token/error state after calling to determine success.
             */
            refreshToken: async () => {
                set({ loading: true, error: null });
                try {
                    await refreshToken();
                    const userData = await getMe();
                    set({
                        user: userData,
                        token: 'cookie-based', // Placeholder since token is now in httpOnly cookie
                        loading: false,
                        error: null
                    });
                } catch (e: unknown) {
                    set({
                        error: getErrorMessage(e, 'Failed to refresh token'),
                        loading: false,
                        user: null,
                        token: null
                    });
                    log.error('Token refresh failed', e);
                }
            },

            /**
             * Logout Sequence:
             *   1. Clear user and token from the store.
             *   2. Clear any existing error messages.
             *   3. Set loading to false.
             *   4. Remove the token from localStorage.
             * 
             * TODO: Implement server-side logout if supported.
             * Note: This is a local logout. If your backend supports server-side
             * logout (e.g., invalidating tokens), you may want to call that API here.
             */
            logout: () => {
                set({
                    user: null,
                    token: null,
                    error: null,
                    loading: false
                });
                // Call the logout API to clear cookies
                apiLogout().catch((e: unknown) => log.error('Logout API call failed', e));
            },

            /**
             * Clear the current error message.
             *
             * Note: This setter isn't currently referenced anywhere in the
             * codebase (searched `src/`), but it's intentionally exposed so
             * callers have an easy, consistent API for clearing auth errors.
             * Keeping it avoids coupling consumers to implementation details
             * (they can call `useAuthStore(state => state.clearError())`) and
             * is convenient for tests, ad-hoc scripts, or future features.
             *
             * If you prefer a minimal public API you can remove it after
             * verifying there are no external usages (including tests and
             * non-`src/` scripts).
             */
            clearError: () => {
                set({ error: null });
            },

            /**
             * Manually set the loading state.
             *
             * Exposed for the same reasons as `clearError`: it's not used
             * currently but is useful for imperative flows, tests, and
             * lower-level components that may want to toggle auth loading
             * without invoking a full action (login/register/refresh).
             */
            setLoading: (loading: boolean) => {
                set({ loading });
            },

            /**
             * Manually set the token in the store.
             *
             * Useful for bootstrapping state (for example, setting a token
             * loaded from a custom storage), tests, or third-party code that
             * needs to inject credentials without calling `login`.
             *
             * Note: `persist` controls what is saved; updating the token via
             * this setter will still be persisted according to the middleware
             * configuration.
             */
            setToken: (token: string | null) => set({ token }),

            /**
             * Manually set the current user object.
             *
             * Like `setToken`, this is exposed to allow imperative updates and
             * test helpers. It's intentionally simple — if you remove it,
             * callers must use the higher-level actions (login/refresh) or
             * modify the persisted state via the middleware.
             */
            setUser: (user: User | null) => set({ user }),
        }),
        {
            /** 
             * Persist middleware to save user to localStorage.
             * 
             * Note: We no longer persist tokens as they are stored securely in httpOnly cookies.
             * Only user information is persisted for UI state continuity.
             * 
             * */
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                // token removed from persistence for security
            }),
        }
    )
);
