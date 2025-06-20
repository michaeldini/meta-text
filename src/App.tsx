/**
 * Enhanced App.tsx with light/dark theme support
 * This shows how to integrate the theme system into your existing app
 */

import { Routes, Route, useLocation } from 'react-router-dom';
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

// Dynamically import pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const SourceDocDetailPage = lazy(() => import('./pages/SourceDocPage/SourceDocDetailPage'));
const MetaTextDetailPage = lazy(() => import('./pages/MetaTextPage/MetaTextDetailPage'));
const MetaTextReviewPage = lazy(() => import('./pages/MetaTextPage/MetaTextReviewPage'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));

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
];

function App() {
    const location = useLocation();
    const { mode, toggleMode } = useThemeContext();

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
    }), []);

    const renderRoute = (route: RouteConfig) => {
        const Component = route.element;
        return (
            <Route
                key={route.path}
                path={route.path}
                element={
                    <Suspense fallback={<AppSuspenseFallback />}>
                        <Component />
                    </Suspense>
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
