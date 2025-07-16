// Main React app component providing routing, theming, and authentication
import { JSX, Suspense, lazy, ComponentType } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, useTheme, Box, Typography } from '@mui/material';

import { NavBar } from 'features';
import { AppSuspenseFallback, ErrorBoundary, GlobalNotifications } from 'components';

import { getAppStyles, lightTheme, darkTheme } from './styles';
import { useAuthStore } from 'store';
// ...existing code...
import { useThemeContext } from './contexts/ThemeContext';

// Dynamically import pages for code splitting using barrel exports
const HomePage = lazy(() => import('pages').then(module => ({ default: module.HomePage })));
const SourceDocPage = lazy(() => import('pages').then(module => ({ default: module.SourceDocPage })));
const SourceDocDetailPage = lazy(() => import('pages').then(module => ({ default: module.SourceDocDetailPage })));
const MetatextPage = lazy(() => import('pages').then(module => ({ default: module.MetatextPage })));
const MetatextDetailPage = lazy(() => import('pages').then(module => ({ default: module.MetatextDetailPage })));
const MetatextReviewPage = lazy(() => import('pages').then(module => ({ default: module.MetatextReviewPage })));
const LoginPage = lazy(() => import('pages').then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('pages').then(module => ({ default: module.RegisterPage })));
const ExperimentsPage = lazy(() => import('pages').then(module => ({ default: module.ExperimentsPage })));
const AboutPage = lazy(() => import('pages').then(module => ({ default: module.AboutPage })));

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
    { path: '/experiments', element: ExperimentsPage, protected: false },
    { path: '/about', element: AboutPage, protected: false },
];

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
    const { user, loading } = useAuthStore();

    // Show loading state while checking authentication
    if (loading) {
        return <AppSuspenseFallback />;
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

function App() {
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

// Separate component that uses the theme after it's provided

import React, { useEffect } from 'react';
import { useAuthRefresh } from './hooks/useAuthRefresh';
import { useUIPreferencesStore } from 'store/uiPreferences';
import { fetchUserConfig } from 'services/userConfigService';
// ...existing code...


const AppContent = () => {
    useAuthRefresh();
    const theme = useTheme();
    const styles = getAppStyles(theme);
    const hydrateUIPreferences = useUIPreferencesStore(state => state.hydrateUIPreferences);
    const { user } = useAuthStore();

    useEffect(() => {
        if (!user) return;
        // Fetch user config from backend and hydrate Zustand store
        async function fetchAndHydrate() {
            try {
                console.log('Fetching user config...');
                const config = await fetchUserConfig();
                if (config.uiPreferences) {
                    hydrateUIPreferences(config.uiPreferences);
                }
            } catch (err) {
                // Optionally log error
                console.error('Failed to hydrate UI preferences', err);
            }
        }
        fetchAndHydrate();
    }, [user, hydrateUIPreferences]);

    const renderRoute = (route: RouteConfig) => {
        const Component = route.element;
        const element = (
            <Suspense fallback={<AppSuspenseFallback />}>
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
        <Box sx={styles.appContainer}>
            <NavBar />
            <Routes>
                {routes.map(renderRoute)}
                {/* 404 Route */}
                <Route path="*" element={NotFoundElement} />
            </Routes>
            {/* Global components */}
            <GlobalNotifications />
        </Box>
    );
};

export default App;
