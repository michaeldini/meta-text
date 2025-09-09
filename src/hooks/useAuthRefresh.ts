// React hook to automatically refresh JWT using the backend refresh endpoint
// Triggers before token expiry, updates Zustand store, and logs out on failure
import { useEffect, useRef } from 'react';

import log from '@utils/logger';
import { useAuthStore } from '@store/authStore';

// Helper to decode JWT and get exp (expiration) in seconds
function getTokenExpiration(token: string): number | null {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return typeof payload.exp === 'number' ? payload.exp : null;
    } catch {
        return null;
    }
}


export function useAuthRefresh() {
    const token = useAuthStore(state => state.token);
    // Use the store's refreshToken implementation so all
    // token/user/localStorage behavior stays in one place.
    const refresh = useAuthStore(state => state.refreshToken);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!token) {
            if (timerRef.current) clearTimeout(timerRef.current);
            return;
        }
        const exp = getTokenExpiration(token);
        if (!exp) {
            log.warn('[useAuthRefresh] Could not decode token expiration');
            return;
        }
        const now = Math.floor(Date.now() / 1000);
        // Refresh 2 minutes before expiry, but not less than 10 seconds from now
        const refreshIn = Math.max((exp - now - 120), 10);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(async () => {
            try {
                // Delegate refresh work to the auth store. That
                // function updates the store and localStorage and
                // handles failures (clearing state / logging out).
                await refresh();
            } catch (err) {
                // refreshToken in the store handles failures and
                // usually won't rethrow, but log defensively here.
                log.error('[useAuthRefresh] Token refresh failed', err);
            }
        }, refreshIn * 1000);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [token, refresh]);
}
