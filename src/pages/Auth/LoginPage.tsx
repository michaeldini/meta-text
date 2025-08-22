import React from 'react';
import { useAuthStore } from '@store/authStore';
import { AuthForm } from './AuthForm';

export function LoginPage() {
    const login = useAuthStore(state => state.login);
    const loading = useAuthStore(state => state.loading);
    const error = useAuthStore(state => state.error);

    return (
        <AuthForm
            title="Login"
            submitText="Login"
            authAction={login}
            redirectOnSuccess="/"
            loading={loading}
            error={error}
            passwordAutoComplete="current-password"
            errorTestId="login-error"
        />
    );
};

export default LoginPage;
