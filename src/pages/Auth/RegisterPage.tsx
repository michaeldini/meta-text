import React from 'react';
import { useAuthStore } from '@store/authStore';
import { AuthForm } from './AuthForm';

export function RegisterPage() {
    const register = useAuthStore(state => state.register);
    const loading = useAuthStore(state => state.loading);
    const error = useAuthStore(state => state.error);

    return (
        <AuthForm
            title="Register"
            submitText="Register (Currently closed. Come back later!)"
            authAction={register}
            redirectOnSuccess="/login"
            loading={loading}
            error={error}
            passwordAutoComplete="new-password"
            disabled
        />
    );
};

export default RegisterPage;
