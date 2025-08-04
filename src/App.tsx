/* 
*  Main application component for MetaText
*  - Sets up routing and lazy loading for pages
*/
import React, { useEffect, JSX, Suspense, lazy, ComponentType } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Box, Spinner, Stack, Text } from '@chakra-ui/react';
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

const SourceDocPage = lazy(() => import('@pages/SourceDocument/SourceDocPage'));
const SourceDocDetailPage = lazy(() => import('@pages/SourceDocument/SourceDocDetailPage'));

const MetatextPage = lazy(() => import('@pages/Metatext/MetatextPage'));
const MetatextDetailPage = lazy(() => import('@pages/Metatext/MetatextDetailPage'));
const MetatextReviewPage = lazy(() => import('@pages/Metatext/MetatextReviewPage'));

const ExperimentsPage = lazy(() => import('@pages/ExperimentsPage'));

/**
 * Route configuration interface and route definitions
 * - Defines paths and components for each route
 * - Supports protected routes that require authentication
 */

interface RouteConfig {
    path: string;
    element: ComponentType<{}>;
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
];


/**
 * Protected route component
 * - Checks if user is authenticated before rendering children
 * - Redirects to login if not authenticated
 */
interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
    const { user, loading } = useAuthStore();

    // Show loading state while checking authentication
    if (loading) {
        return <Spinner aria-label="Loading page" />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

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
const App = () => {
    return (
        <Boundary fallbackText="Loading app...">
            <AppContent />
        </Boundary>
    );
};


/**
 * Main application content
 * - Sets up routing and lazy loading for pages
 * - Wraps routes in a Suspense fallback for loading state
 * - Protected routes are wrapped in a ProtectedRoute component
 */
export const AppContent = () => {
    // Refresh auth token on mount
    // This will ensure the user is authenticated when the app loads
    // # TODO: Not sure if or how this is working.
    useAuthRefresh();

    // Hydrate user configuration when user logs in
    // if there is no user, this will not trigger
    const { user } = useAuthStore();
    useUserConfig(!!user);


    const renderRoute = (route: RouteConfig) => {
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
    };

    return (
        <Box>
            <GlobalNotifications />
            <Toaster />
            <NavBar />
            <Routes>
                {routes.map(renderRoute)}
                {/* 404 Route */}
                <Route path="*" element={NotFoundElement} />
            </Routes>
        </Box>
    );
};

export default App;
