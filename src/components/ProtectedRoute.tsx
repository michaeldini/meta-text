/**
 * ProtectedRoute
 * - Renders children when a user is authenticated
 * - Redirects to /login when not authenticated
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spinner } from '@chakra-ui/react';
import { useAuthStore } from '@store/authStore';

interface Props {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
    const { user, loading } = useAuthStore();

    if (loading) return <Spinner aria-label="Loading page" />;
    if (!user) return <Navigate to="/login" replace />;

    return <>{children}</>;
}
