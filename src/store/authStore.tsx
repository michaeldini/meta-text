import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, getMe } from '../services/authService';

interface User {
    id: number;
    username: string;
    // Add other user fields as needed
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    register: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    const login = useCallback(async (username: string, password: string) => {
        setLoading(true); setError(null);
        try {
            const { access_token } = await apiLogin({ username, password });
            setToken(access_token);
            const userData = await getMe(access_token);
            setUser(userData);
            setLoading(false);
            return true;
        } catch (e: any) {
            setError(e.message);
            setLoading(false);
            return false;
        }
    }, []);

    const register = useCallback(async (username: string, password: string) => {
        setLoading(true); setError(null);
        try {
            await apiRegister({ username, password });
            setLoading(false);
            return true;
        } catch (e: any) {
            setError(e.message);
            setLoading(false);
            return false;
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }, []);

    const value: AuthContextType = { user, token, loading, error, login, register, logout };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}
