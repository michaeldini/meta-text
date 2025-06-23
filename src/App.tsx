/**
 * Enhanced App.tsx with light/dark theme support
 * This shows how to integrate the theme system into your existing app
 */

import React, { JSX } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Fade, Box, Typography } from '@mui/material';
import { useMemo, Suspense, lazy, ComponentType } from 'react';

import { NavBar } from './features/navbar';
import { AppSuspenseFallback } from './components/AppSuspenseFallback';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalNotifications from './components/GlobalNotifications';
import FloatingChunkToolbar from './features/chunks/layouts/toolbars/FloatingChunkToolbar';

// Import theme system
import { useThemeContext } from './contexts/ThemeContext';
import { lightTheme, darkTheme } from './styles/themes';
import { appContainerStyles } from './styles/styles';
import { useAuthStore } from './store/authStore';

// Dynamically import pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const SourceDocDetailPage = lazy(() => import('./pages/SourceDocPage/SourceDocDetailPage'));
const MetaTextDetailPage = lazy(() => import('./pages/MetaTextPage/MetaTextDetailPage'));
const MetaTextReviewPage = lazy(() => import('./pages/MetaTextPage/MetaTextReviewPage'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const ExperimentsPage = lazy(() => import('./pages/ExperimentsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

interface RouteConfig {
    path: string;
    element: ComponentType<any>;
    protected?: boolean;
}

const routes: RouteConfig[] = [
    { path: '/', element: HomePage, protected: true },
    { path: '/login', element: LoginPage, protected: false },
    { path: '/register', element: RegisterPage, protected: false },
    { path: '/source-document/:sourceDocId', element: SourceDocDetailPage, protected: true },
    { path: '/metaText/:metaTextId', element: MetaTextDetailPage, protected: true },
    { path: '/metaText/:metaTextId/review', element: MetaTextReviewPage, protected: true },
    { path: '/experiments', element: ExperimentsPage, protected: false },
    { path: '/about', element: AboutPage, protected: false },
];

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { user } = useAuthStore();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    const { mode } = useThemeContext();

    // Get current theme based on mode
    const currentTheme = useMemo(() => {
        return mode === 'light' ? lightTheme : darkTheme;
    }, [mode]);

    // Navbar config
    const navbarConfig = useMemo(() => ({
        brand: {
            label: 'Meta-Text',
            path: '/',
        },
        items: [
            {
                id: 'about',
                label: 'About',
                path: '/about',
                showWhen: 'always' as const,
            },
        ],
    }), []);

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
        <ThemeProvider theme={currentTheme}>
            {/* CssBaseline provides consistent CSS reset and applies theme background */}
            <CssBaseline />

            <ErrorBoundary>
                <Box sx={appContainerStyles}>
                    <NavBar config={navbarConfig} />

                    <Fade in={true} timeout={300}>
                        <Box component="main">
                            <Routes>
                                {routes.map(renderRoute)}

                                {/* 404 Route */}
                                <Route path="*" element={
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        minHeight: '50vh'
                                    }}>
                                        <Typography variant="h4" color="text.secondary">
                                            Page not found
                                        </Typography>
                                    </Box>
                                } />
                            </Routes>
                        </Box>
                    </Fade>

                    {/* Global components */}
                    <GlobalNotifications />
                    <FloatingChunkToolbar />
                </Box>
            </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;
