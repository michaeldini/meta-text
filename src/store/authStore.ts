import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin, register as apiRegister, getMe } from '../services/authService';
import { getErrorMessage } from '../types/error';

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
    logout: () => void;
    clearError: () => void;
    setLoading: (loading: boolean) => void;
    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
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
                    return true;
                } catch (e: unknown) {
                    set({
                        error: getErrorMessage(e, 'Login failed'),
                        loading: false,
                        user: null,
                        token: null
                    });
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

            logout: () => {
                set({
                    user: null,
                    token: null,
                    error: null,
                    loading: false
                });
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

// Convenience hook that maintains the same interface as the old useAuth
export const useAuth = () => {
    const { user, token, loading, error, login, register, logout, clearError } = useAuthStore();
    return { user, token, loading, error, login, register, logout, clearError };
};
