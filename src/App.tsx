import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import { Fade, CircularProgress } from '@mui/material';
import { useMemo, Suspense, lazy } from 'react';
import { appSuspenseFallback } from './styles/pageStyles';

// Dynamically import pages for code splitting
const SourceDocsPage = lazy(() => import('./pages/SourceDocPage/SourceDocsPage'));
const SourceDocDetailPage = lazy(() => import('./pages/SourceDocPage/SourceDocDetailPage'));
const MetaTextPage = lazy(() => import('./pages/MetaTextPage/MetaTextPage'));
const MetaTextDetailPage = lazy(() => import('./pages/MetaTextPage/MetaTextDetailPage'));
const MetaTextReviewPage = lazy(() => import('./pages/MetaTextPage/MetaTextReviewPage'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const AuthGate = lazy(() => import('./pages/Auth/AuthGate'));

function App() {
    const location = useLocation();
    // Use location.key as a unique key for transitions
    const routeElement = useMemo(() => (
        <Suspense fallback={<div style={appSuspenseFallback}><CircularProgress /></div>}>
            <Routes location={location} key={location.key}>
                <Route path="/" element={<h1>Welcome to Meta-Text</h1>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/sourceDocs" element={
                    <AuthGate>
                        <SourceDocsPage />
                    </AuthGate>
                } />
                <Route path="/sourceDocs/:sourceDocId" element={
                    <AuthGate>
                        <SourceDocDetailPage />
                    </AuthGate>
                } />
                <Route path="/metaText" element={
                    <AuthGate>
                        <MetaTextPage />
                    </AuthGate>
                } />
                <Route path="/metaText/:metaTextId" element={
                    <AuthGate>
                        <MetaTextDetailPage />
                    </AuthGate>
                } />
                <Route path="/metaText/:metaTextId/review" element={
                    <AuthGate>
                        <MetaTextReviewPage />
                    </AuthGate>
                } />
            </Routes>
        </Suspense>
    ), [location]);

    return (
        <>
            <NavBar />
            <Fade in={true} key={location.pathname} timeout={750}>
                <div>{routeElement}</div>
            </Fade>
        </>
    );
}

export default App;
