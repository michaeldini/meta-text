/**
 * ProtectedRoute
 * - Renders children when a user is authenticated
 * - Redirects to /login when not authenticated
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { styled } from '@styles';
import { useAuthStore } from '@store/authStore';

interface Props {
    children: React.ReactNode;
}

const Spinner = styled('div', {
    display: 'inline-block',
    width: 32,
    height: 32,
    border: '4px solid $gray6',
    borderTop: '4px solid $blue9',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },
});

export default function ProtectedRoute({ children }: Props) {
    const { user, loading } = useAuthStore();

    if (loading) return <Spinner aria-label="Loading page" />;
    if (!user) return <Navigate to="/login" replace />;

    return <>{children}</>;
}
