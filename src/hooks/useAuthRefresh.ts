// React hook to automatically refresh JWT using the backend refresh endpoint
// Triggers before token expiry, updates Zustand store, and logs out on failure
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { refreshToken as apiRefreshToken, getMe } from '../services/authService';

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
        if (!token) {
            if (timerRef.current) clearTimeout(timerRef.current);
            return;
        }
        const exp = getTokenExpiration(token);
        if (!exp) return;
        const now = Math.floor(Date.now() / 1000);
        // Refresh 2 minutes before expiry, but not less than 10 seconds from now
        const refreshIn = Math.max((exp - now - 120), 10);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(async () => {
            try {
                const { access_token } = await apiRefreshToken();
                setToken(access_token);
                const userData = await getMe(access_token);
                setUser(userData);
            } catch {
                logout();
            }
        }, refreshIn * 1000);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [token, setToken, setUser, logout]);
}
