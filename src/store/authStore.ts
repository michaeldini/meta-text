import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { login as apiLogin, register as apiRegister, getMe, refreshToken } from '@services/authService';
import log from '@utils/logger';
import { getErrorMessage } from '@mtypes/error';


interface User {
    id: number;
    username: string;
    // Add other user fields as needed
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    register: (username: string, password: string) => Promise<boolean>;
    refreshToken: () => Promise<void>;
    logout: () => void;
    clearError: () => void;
    setLoading: (loading: boolean) => void;
    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            loading: false,
            error: null,

            login: async (username: string, password: string) => {
                set({ loading: true, error: null });
                try {
                    const { access_token } = await apiLogin({ username, password });
                    const userData = await getMe(access_token);
                    set({
                        user: userData,
                        token: access_token,
                        loading: false,
                        error: null
                    });
                    localStorage.setItem('access_token', access_token);
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
                    localStorage.removeItem('access_token');
                    log.error('Login failed', e);
                    return false;
                }
            },

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
            refreshToken: async () => {
                set({ loading: true, error: null });
                try {
                    const { access_token } = await refreshToken();
                    const userData = await getMe(access_token);
                    set({
                        user: userData,
                        token: access_token,
                        loading: false,
                        error: null
                    });
                    localStorage.setItem('access_token', access_token);
                } catch (e: unknown) {
                    set({
                        error: getErrorMessage(e, 'Failed to refresh token'),
                        loading: false,
                        user: null,
                        token: null
                    });
                    localStorage.removeItem('access_token');
                    log.error('Token refresh failed', e);
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    error: null,
                    loading: false
                });
                localStorage.removeItem('access_token');
            },

            clearError: () => {
                set({ error: null });
            },

            setLoading: (loading: boolean) => {
                set({ loading });
            },
            setToken: (token: string | null) => set({ token }),
            setUser: (user: User | null) => set({ user }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token
            }),
        }
    )
);
