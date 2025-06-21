// import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { NavBar } from './features/navbar';
import { Fade, Box, Typography } from '@mui/material';
import { useMemo, Suspense, lazy, ComponentType } from 'react';
import { AppSuspenseFallback } from './components/AppSuspenseFallback';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalNotifications from './components/GlobalNotifications';
import FloatingChunkToolbar from './features/chunks/layouts/toolbars/FloatingChunkToolbar';

// Dynamically import pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const SourceDocDetailPage = lazy(() => import('./pages/SourceDocPage/SourceDocDetailPage'));
const MetaTextDetailPage = lazy(() => import('./pages/MetaTextPage/MetaTextDetailPage'));
const MetaTextReviewPage = lazy(() => import('./pages/MetaTextPage/MetaTextReviewPage'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const AuthGate = lazy(() => import('./pages/Auth/AuthGate'));

// 404 Page component
const NotFoundPage = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <Typography variant="h4" component="h1" gutterBottom>
            404 - Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
            The page you're looking for doesn't exist.
        </Typography>
    </Box>
);

// Type for route configuration
interface RouteConfig {
    path: string;
    element: ComponentType;
    protected: boolean;
}

// Route configuration for better maintainability
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

    // Use consistent key for both routing and transitions
    const transitionKey = location.pathname + location.search;

    const routeElement = useMemo(() => (
        <ErrorBoundary>
            <Suspense fallback={<AppSuspenseFallback />}>
                <Routes location={location}>
                    {routes.map(({ path, element: Component, protected: isProtected }) => (
                        <Route
                            key={path}
                            path={path}
                            element={
                                isProtected ? (
                                    <AuthGate>
                                        <Component />
                                    </AuthGate>
                                ) : (
                                    <Component />
                                )
                            }
                        />
                    ))}
                    {/* 404 Route - must be last */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </ErrorBoundary>
    ), [location]);

    return (
        <>
            <NavBar />
            <Fade in={true} key={transitionKey} timeout={400}>
                <div>{routeElement}</div>
            </Fade>
            <GlobalNotifications />
            <FloatingChunkToolbar />
        </>
    );
}

export default App;
