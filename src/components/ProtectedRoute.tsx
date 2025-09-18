/**
 * ProtectedRoute
 * 
 * - Renders children when a user is authenticated
 * - Redirects to /login when not authenticated
 * 
 * Uses useAuthStore to access authentication state
 * 
 * Usage: Wrap any route/component that requires authentication in <ProtectedRoute> ... </ProtectedRoute>
 * 
 * Example:
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 * 
 * 
 * 
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';

interface Props {
    children: React.ReactNode;
}

/**
 * ProtectedRoute component
 *
 * Renders its children only when a user is authenticated.
 * If no user is present in the auth store, the component redirects to "/login".
 *
 * @param props.children - The content to render for authenticated users.
 * @returns JSX.Element - The children when authenticated, otherwise a <Navigate> redirect.
 *
 * @example
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 *
 * @remarks
 * This component uses useAuthStore to obtain the current user state.
 */
export default function ProtectedRoute({ children }: Props) {
    const { user } = useAuthStore();
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
}
