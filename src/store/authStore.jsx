// src/store/authStore.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getMe } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    const login = useCallback(async (username, password) => {
        setLoading(true); setError(null);
        try {
            const { access_token } = await apiLogin({ username, password });
            setToken(access_token);
            const userData = await getMe(access_token);
            setUser(userData);
            setLoading(false);
            return true;
        } catch (e) {
            setError(e.message);
            setLoading(false);
            return false;
        }
    }, []);

    const register = useCallback(async (username, password) => {
        setLoading(true); setError(null);
        try {
            await apiRegister({ username, password });
            setLoading(false);
            return true;
        } catch (e) {
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

    const value = { user, token, loading, error, login, register, logout };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
