import React from 'react';
import { useAuthStore } from '@store/authStore';
import AuthForm from './AuthForm';

function RegisterPage() {
    const register = useAuthStore(state => state.register);
    const loading = useAuthStore(state => state.loading);
    const error = useAuthStore(state => state.error);

    const handleRegister = async ({ email, password }: { email: string; password: string }) => {
        // Map email to username for backend
        return await register(email, password);
    };
    return (
        <AuthForm
            type="register"
            onSubmit={handleRegister}
            error={error ?? undefined}
            loading={loading}
            redirectOnSuccess="/login"
        />
    );
}

export default RegisterPage;
