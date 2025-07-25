/* 
*  Main application component for MetaText
*  - Sets up routing and lazy loading for pages
*/
import React, { useEffect, JSX, Suspense, lazy, ComponentType } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, useTheme, Typography } from '@mui/material';
import { Box, Stack, Text } from '@chakra-ui/react';
import { NavBar } from 'features';
import { LoadingFallback, ErrorBoundary, GlobalNotifications } from 'components';
import { useAuthStore } from 'store';
import { useAuthRefresh } from 'hooks';
import { getAppStyles, lightTheme, darkTheme } from 'styles';
import { useUserConfig } from 'services';

import { useThemeContext } from './contexts/ThemeContext';

/** Dynamically import pages for code splitting using barrel exports
 * This allows for lazy loading of components
 * and reduces initial bundle size.
 * Each page is wrapped in a lazy function to enable code splitting.
 * The `default` export is used to ensure compatibility with the lazy loading syntax.
 */
const HomePage = lazy(() => import('pages').then(module => ({ default: module.HomePage })));
const LoginPage = lazy(() => import('pages').then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('pages').then(module => ({ default: module.RegisterPage })));

const SourceDocPage = lazy(() => import('pages').then(module => ({ default: module.SourceDocPage })));
const SourceDocDetailPage = lazy(() => import('pages').then(module => ({ default: module.SourceDocDetailPage })));

const MetatextPage = lazy(() => import('pages').then(module => ({ default: module.MetatextPage })));
const MetatextDetailPage = lazy(() => import('pages').then(module => ({ default: module.MetatextDetailPage })));
const MetatextReviewPage = lazy(() => import('pages').then(module => ({ default: module.MetatextReviewPage })));

const ExperimentsPage = lazy(() => import('pages').then(module => ({ default: module.ExperimentsPage })));

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

    { path: '/sourcedoc', element: SourceDocPage, protected: true },
    { path: '/sourcedoc/:sourceDocId', element: SourceDocDetailPage, protected: true },

    { path: '/metatext', element: MetatextPage, protected: true },
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
        return <LoadingFallback />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Static 404 component to prevent recreation on each render
const NotFoundElement = (
    <Box>
        <Typography variant="h4" color="text.secondary">
            Page not found
        </Typography>
    </Box>
);

/**
 * Main application component
 * - Sets up theming and routing
 */
export function App() {
    const { mode } = useThemeContext();
    const currentTheme = mode === 'light' ? lightTheme : darkTheme;

    return (
        <>
            {/* <LandscapeRequiredOverlay /> */}
            <ThemeProvider theme={currentTheme}>
                {/* CssBaseline provides consistent CSS reset and applies theme background */}
                <CssBaseline />
                <ErrorBoundary>
                    <AppContent />
                </ErrorBoundary>
            </ThemeProvider>
        </>
    );
}


/**
 * Main application content
 * - Sets up routing and lazy loading for pages
 * - Wraps routes in a Suspense fallback for loading state
 * - Protected routes are wrapped in a ProtectedRoute component
 */
export const AppContent = () => {
    useAuthRefresh();
    const theme = useTheme();
    const styles = getAppStyles(theme);

    const renderRoute = (route: RouteConfig) => {
        const Component = route.element;
        const element = (
            <Suspense fallback={<LoadingFallback />}>
                <Component />
            </Suspense>
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
        <Box bg="simple">
            <GlobalNotifications />
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
