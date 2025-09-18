/**
 * React hook to automatically refresh JWT tokens using the backend refresh endpoint.
 * 
 * Depends on the Zustand auth store for token state and refresh logic.
 *
 * - Schedules a refresh before token expiry to keep the user authenticated.
 * - Delegates refresh logic to the Zustand auth store for centralized state management.
 * - Handles token decoding, refresh timing, and error logging.
 * - Logs out the user on refresh failure (handled by the store).
 */
import { useEffect, useRef } from 'react';
import log from '@utils/logger';
import { useAuthStore } from '@store/authStore';


/**
 * Decodes a JWT and extracts the expiration time (exp claim) in seconds since epoch.
 *
 * @param token - The JWT string to decode.
 * @returns The expiration timestamp in seconds, or null if decoding fails.
 */
function getTokenExpiration(token: string): number | null {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return typeof payload.exp === 'number' ? payload.exp : null;
    } catch {
        return null;
    }
}


/**
 * Custom React hook that manages automatic JWT refresh for authentication.
 *
 * This hook:
 * - Monitors the current JWT token from the Zustand auth store.
 * - Schedules a refresh operation to occur shortly before the token expires.
 * - Uses a timer to trigger the refresh, ensuring the user session remains valid.
 * - Delegates the actual refresh logic to the store's `refreshToken` method, which
 *   updates state, localStorage, and handles logout on failure.
 * - Cleans up timers on unmount or when the token changes.
 *
 * Usage: Call this hook once in your app (e.g., in a top-level component).
 */
export function useAuthRefresh() {
    // Get the current JWT token from the auth store
    const token = useAuthStore(state => state.token);
    // Get the refreshToken method from the auth store for centralized refresh logic
    const refresh = useAuthStore(state => state.refreshToken);
    // Ref to hold the timer ID for scheduled refresh
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // If there is no token, clear any existing timer and exit
        // clearTimeout is a standard global function that cancels a scheduled timeout, and here it ensures only one refresh timer is active at a time.
        if (!token) {
            if (timerRef.current) clearTimeout(timerRef.current);
            return;
        }

        // Decode the token to get its expiration time
        const exp = getTokenExpiration(token);
        if (!exp) {
            log.warn('[useAuthRefresh] Could not decode token expiration');
            return;
        }

        const now = Math.floor(Date.now() / 1000);
        // Calculate when to refresh: 2 minutes before expiry, but at least 10 seconds from now
        const refreshIn = Math.max((exp - now - 120), 10);

        // Clear any existing timer before setting a new one
        if (timerRef.current) clearTimeout(timerRef.current);

        // Schedule the refresh operation
        timerRef.current = setTimeout(async () => {
            try {
                // Delegate refresh work to the auth store. This updates the store and localStorage,
                // and handles failures (clearing state and logging out if needed).
                await refresh();
            } catch (err) {
                // The store's refreshToken usually handles errors, but log defensively here as well.
                log.error('[useAuthRefresh] Token refresh failed', err);
            }
        }, refreshIn * 1000);

        // Cleanup: clear the timer if the token changes or the component unmounts
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [token, refresh]);
}
