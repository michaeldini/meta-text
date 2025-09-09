/* 
*  Main application component for MetaText
*  - Sets up routing and lazy loading for pages
*/
import React, { JSX, lazy, ComponentType } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Box, Spinner, Text } from '@chakra-ui/react';
import { NavBar } from '@features/navbar';
import { GlobalNotifications } from '@components/GlobalNotifications';
import { Toaster } from '@components/ui/toaster'
import { Boundary } from '@components/Boundaries';
import { useAuthStore } from '@store/authStore';
import { useAuthRefresh } from '@hooks/useAuthRefresh';

import { useUserConfig } from '@services/userConfigService';

/** Dynamically import pages for code splitting using barrel exports
 * This allows for lazy loading of components
 * and reduces initial bundle size.
 * Each page is wrapped in a lazy function to enable code splitting.
 * The `default` export is used to ensure compatibility with the lazy loading syntax.
 */
const HomePage = lazy(() => import('@pages/HomePage/HomePage'));
const LoginPage = lazy(() => import('@pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('@pages/Auth/RegisterPage'));

const SourceDocDetailPage = lazy(() => import('@pages/SourceDocument/SourceDocDetailPage'));

const MetatextDetailPage = lazy(() => import('@pages/Metatext/MetatextDetailPage'));
const MetatextReviewPage = lazy(() => import('@pages/Metatext/MetatextReviewPage'));

const ExperimentsPage = lazy(() => import('@pages/ExperimentsPage'));
const RussianDollsPage = lazy(() => import('@pages/RussianDollsPage'));

/**
 * Route configuration interface and route definitions
 * - Defines paths and components for each route
 * - Supports protected routes that require authentication
 */

interface RouteConfig {
    path: string;
    element: ComponentType<Record<string, never>>;
    protected?: boolean;
}

const routes: RouteConfig[] = [
    { path: '/', element: HomePage, protected: true },
    { path: '/login', element: LoginPage, protected: false },
    { path: '/register', element: RegisterPage, protected: false },

    { path: '/sourcedoc/:sourceDocId', element: SourceDocDetailPage, protected: true },
    { path: '/metatext/:metatextId', element: MetatextDetailPage, protected: true },
    { path: '/metatext/:metatextId/review', element: MetatextReviewPage, protected: true },

    { path: '/experiments', element: ExperimentsPage, protected: true },
    { path: '/russiandolls', element: RussianDollsPage, protected: true },
];


/**
 * Protected route component
 * - Checks if user is authenticated before rendering children
 * - Redirects to login if not authenticated
 */
interface ProtectedRouteProps {
    children: JSX.Element;
}

function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
    const { user, loading } = useAuthStore();

    // Show loading state while checking authentication
    if (loading) {
        return <Spinner aria-label="Loading page" />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

// Static 404 component to prevent recreation on each render
const NotFoundElement = (
    <Box>
        <Text>
            Page not found
        </Text>
    </Box>
);


/**
 * Main application component
 * - Sets up theming and routing
 */
export default function App() {
    return (
        <Boundary fallbackText="Loading app...">
            <AppContent />
        </Boundary>
    );
}


/**
 * Main application content
 * - Sets up routing and lazy loading for pages
 * - Wraps routes in a Suspense fallback for loading state
 * - Protected routes are wrapped in a ProtectedRoute component
 */
export function AppContent() {
    // Refresh auth token on mount
    // This will ensure the user is authenticated when the app loads
    // # TODO: Not sure if or how this is working.
    useAuthRefresh();

    // Hydrate user configuration when user logs in
    // if there is no user, this will not trigger
    const { user } = useAuthStore();
    useUserConfig(!!user);

    function renderRoute(route: RouteConfig) {
        const Component = route.element;
        const element = (
            <Boundary fallbackText="Loading">
                <Component />
            </Boundary>
        );
        return (
            <Route
                key={route.path}
                path={route.path}
                element={
                    route.protected ? <ProtectedRoute>{element}</ProtectedRoute> : element
                }
            />
        );
    }

    return (
        <Box>
            <Toaster />
            <GlobalNotifications />
            <NavBar />
            <Routes>
                {routes.map(renderRoute)}
                {/* 404 Route */}
                <Route path="*" element={NotFoundElement} />
            </Routes>
        </Box>
    );
}
