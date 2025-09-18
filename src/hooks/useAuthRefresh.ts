/**
 * ┌─────────────────────┐    ┌─────────────────────┐
 * │   useAuthRefresh    │    │      ky.js          │
 * │   (Primary - 95%)   │    │   (Fallback - 5%)   │
 * ├─────────────────────┤    ├─────────────────────┤
 * │ • Activity tracking │    │ • 401/403 detection │
 * │ • Proactive refresh │    │ • Single retry      │
 * │ • 25-min intervals  │    │ • Graceful fallback │
 * │ • Smart scheduling  │    │ • Error handling    │
 * └─────────────────────┘    └─────────────────────┘
 *            │                       │
 *            └───────┬───────────────┘
 *                    │
 *            ┌───────▼────────┐
 *            │  authStore.ts  │
 *            │ (Centralized)  │
 *            │ • State mgmt   │
 *            │ • API calls    │
 *            │ • Error hdlg   │
 *            └────────────────┘
 * React hook to automatically refresh JWT tokens using the backend refresh endpoint.
 * 
 * Depends on the Zustand auth store for user state and refresh logic.
 *
 * - Schedules proactive refresh before token expiry to keep users authenticated.
 * - Includes activity detection to avoid unnecessary refreshes for inactive users.
 * - Delegates refresh logic to the Zustand auth store for centralized state management.
 * - Handles refresh timing, activity monitoring, and error logging.
 * - Works with httpOnly cookie-based authentication for enhanced security.
 * - Primary refresh mechanism with ky.js as fallback for edge cases.
 */
import { useEffect, useRef, useCallback } from 'react';
import log from '@utils/logger';
import { useAuthStore } from '@store/authStore';


/**
 * Enhanced React hook that manages automatic JWT refresh with activity detection.
 *
 * This hook:
 * - Monitors the user authentication state from the Zustand auth store.
 * - Tracks user activity to avoid unnecessary refreshes for inactive users.
 * - Schedules proactive refresh operations 5 minutes before token expiry.
 * - Only refreshes tokens when the user has been active in the last 10 minutes.
 * - Uses a recursive scheduling approach for continuous session maintenance.
 * - Delegates the actual refresh logic to the store's `refreshToken` method.
 * - Cleans up timers and event listeners on unmount or when the user logs out.
 *
 * Usage: Call this hook once in your app (e.g., in App.tsx or a top-level component).
 */
export function useAuthRefresh() {
    // Get the current user from the auth store (indicates if logged in)
    const user = useAuthStore(state => state.user);
    // Get the refreshToken method from the auth store for centralized refresh logic
    const refresh = useAuthStore(state => state.refreshToken);
    // Ref to hold the timer ID for scheduled refresh
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Track the last user activity time
    const lastActivityRef = useRef(Date.now());

    // Update activity timestamp when user interacts with the app
    const updateActivity = useCallback(() => {
        lastActivityRef.current = Date.now();
    }, []);

    // Check if user has been active in the last 10 minutes
    const isUserActive = useCallback(() => {
        const inactivityThreshold = 10 * 60 * 1000; // 10 minutes in milliseconds
        return Date.now() - lastActivityRef.current < inactivityThreshold;
    }, []);

    // Set up activity tracking event listeners
    useEffect(() => {
        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        // Add event listeners for user activity
        activityEvents.forEach(event => {
            document.addEventListener(event, updateActivity, { passive: true });
        });

        // Cleanup event listeners
        return () => {
            activityEvents.forEach(event => {
                document.removeEventListener(event, updateActivity);
            });
        };
    }, [updateActivity]);

    useEffect(() => {
        // If there is no user, clear any existing timer and exit
        if (!user) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            return;
        }

        // Recursive function to schedule the next refresh
        const scheduleNextRefresh = () => {
            // Clear any existing timer
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            // Schedule refresh 5 minutes before 30-minute token expiry = 25 minutes
            const refreshIntervalMs = 25 * 60 * 1000; // 25 minutes

            timerRef.current = setTimeout(async () => {
                // Only refresh if user has been active recently
                if (isUserActive()) {
                    try {
                        log.info('[useAuthRefresh] Refreshing token for active user');
                        await refresh();
                        log.info('[useAuthRefresh] Token refreshed successfully');

                        // Schedule the next refresh cycle
                        scheduleNextRefresh();
                    } catch (err) {
                        log.error('[useAuthRefresh] Token refresh failed', err);
                        // Don't schedule another refresh on failure - let the store handle logout
                        // The ky.js fallback will handle any subsequent 401/403 responses
                    }
                } else {
                    log.info('[useAuthRefresh] User inactive, skipping refresh. Will check again in 5 minutes.');

                    // User is inactive, check again in 5 minutes
                    timerRef.current = setTimeout(scheduleNextRefresh, 5 * 60 * 1000);
                }
            }, refreshIntervalMs);
        };

        // Start the refresh cycle
        scheduleNextRefresh();

        // Cleanup: clear the timer when user logs out or component unmounts
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [user, refresh, isUserActive]);
}
