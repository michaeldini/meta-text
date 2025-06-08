import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import { Fade, CircularProgress } from '@mui/material';
import { useMemo, Suspense, lazy } from 'react';
import LoadingIndicator from './components/LoadingIndicator';

// Dynamically import pages for code splitting
const SourceDocsPage = lazy(() => import('./pages/SourceDocPage/SourceDocsPage'));
const SourceDocDetailPage = lazy(() => import('./pages/SourceDocPage/SourceDocDetailPage'));
const MetaTextPage = lazy(() => import('./pages/MetaTextPage/MetaTextPage'));
const MetaTextDetailPage = lazy(() => import('./pages/MetaTextPage/MetaTextDetailPage'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const AuthGate = lazy(() => import('./pages/Auth/AuthGate'));

function App() {
  const location = useLocation();
  // Use location.key as a unique key for transitions
  const routeElement = useMemo(() => (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', marginTop: 64 }}><LoadingIndicator loading={true} size={48} /></div>}>
      <Routes location={location} key={location.key}>
        <Route path="/" element={<h1>Welcome to Meta-Text</h1>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/sourceDocs" element={
          <AuthGate>
            <SourceDocsPage />
          </AuthGate>
        } />
        <Route path="/sourceDocs/:id" element={
          <AuthGate>
            <SourceDocDetailPage />
          </AuthGate>
        } />
        <Route path="/metaText" element={
          <AuthGate>
            <MetaTextPage />
          </AuthGate>
        } />
        <Route path="/metaText/:id" element={
          <AuthGate>
            <MetaTextDetailPage />
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
  )
}

export default App
