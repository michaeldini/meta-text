import React from 'react';
import { useAuthStore } from '@store/authStore';
import AuthForm from './AuthForm';

const LoginPage = () => {
    const login = useAuthStore(state => state.login);
    const loading = useAuthStore(state => state.loading);
    const error = useAuthStore(state => state.error);

    const handleLogin = async ({ email, password }: { email: string; password: string }) => {
        // Map email to username for backend
        return await login(email, password);
    };
    return (
        <AuthForm
            type="login"
            onSubmit={handleLogin}
            error={error ?? undefined}
            loading={loading}
            redirectOnSuccess="/"
        />
    );
};

export default LoginPage;
