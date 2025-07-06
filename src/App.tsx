import React, { JSX } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, useTheme } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { Suspense, lazy, ComponentType } from 'react';

import { NavBar } from 'features';
import { LandscapeRequiredOverlay, AppSuspenseFallback, ErrorBoundary, GlobalNotifications, FlexBox } from 'components';

import { getTopLevelStyles, lightTheme, darkTheme } from './styles';
import { useAuthStore } from 'store';
import { useThemeContext } from './contexts/ThemeContext';
import './styles/landscape.css';

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
    const theme = useTheme();
    const styles = getTopLevelStyles(theme);
    const currentTheme = mode === 'light' ? lightTheme : darkTheme;

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

    const NotFoundElement = (
        <FlexBox>
            <Typography variant="h4" color="text.secondary">
                Page not found
            </Typography>
        </FlexBox>
    );

    return (
        <>
            {/* <LandscapeRequiredOverlay /> */}
            <ThemeProvider theme={currentTheme}>
                {/* CssBaseline provides consistent CSS reset and applies theme background */}
                <CssBaseline />
                <ErrorBoundary>
                    <Box sx={styles.appContainerStyles}>
                        <NavBar />
                        <Routes>
                            {routes.map(renderRoute)}
                            {/* 404 Route */}
                            <Route path="*" element={NotFoundElement} />
                        </Routes>
                        {/* Global components */}
                        <GlobalNotifications />
                    </Box>
                </ErrorBoundary>
            </ThemeProvider>
        </>
    );
}

export default App;
