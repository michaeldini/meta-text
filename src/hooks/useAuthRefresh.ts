// React hook to automatically refresh JWT using the backend refresh endpoint
// Triggers before token expiry, updates Zustand store, and logs out on failure
import { useEffect, useRef } from 'react';

import { log } from 'utils';
import { useAuthStore } from 'store';
import { refreshToken, getMe } from 'services';

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
    const setToken = useAuthStore(state => state.setToken);
    const setUser = useAuthStore(state => state.setUser);
    const logout = useAuthStore(state => state.logout);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        log.info('[useAuthRefresh] Effect triggered', { token });
        if (!token) {
            log.info('[useAuthRefresh] No token, clearing timer');
            if (timerRef.current) clearTimeout(timerRef.current);
            return;
        }
        const exp = getTokenExpiration(token);
        log.info('[useAuthRefresh] Token expiration', { exp });
        if (!exp) {
            log.warn('[useAuthRefresh] Could not decode token expiration');
            return;
        }
        const now = Math.floor(Date.now() / 1000);
        // Refresh 2 minutes before expiry, but not less than 10 seconds from now
        const refreshIn = Math.max((exp - now - 120), 10);
        log.info('[useAuthRefresh] Scheduling refresh', { refreshInSeconds: refreshIn, now, exp });
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(async () => {
            log.info('[useAuthRefresh] Refresh timer fired');
            try {
                const { access_token } = await refreshToken();
                log.info('[useAuthRefresh] Token refreshed successfully');
                setToken(access_token);
                const userData = await getMe(access_token);
                setUser(userData);
            } catch (err) {
                log.error('[useAuthRefresh] Token refresh failed', err);
                logout();
            }
        }, refreshIn * 1000);
        return () => {
            log.info('[useAuthRefresh] Cleaning up timer');
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [token, setToken, setUser, logout]);
}
