import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import './index.css';
import App from './App';
import theme from './styles/theme';
import { AuthProvider } from './store/authStore';
import ErrorBoundary from './components/ErrorBoundary';

if (typeof document !== 'undefined' && document.getElementById('root')) {
    createRoot(document.getElementById('root')!).render(<AppRoot />);
}

export function AppRoot() {
    return (
        <StrictMode>
            <ErrorBoundary>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <AuthProvider>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </AuthProvider>
                </ThemeProvider>
            </ErrorBoundary>
        </StrictMode>
    );
}
