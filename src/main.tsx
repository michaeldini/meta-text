import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeContextProvider } from './contexts/ThemeContext';

if (typeof document !== 'undefined' && document.getElementById('root')) {
    createRoot(document.getElementById('root')!).render(<AppRoot />);
}

export function AppRoot() {
    return (
        <StrictMode>
            <ErrorBoundary>
                <ThemeContextProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </ThemeContextProvider>
            </ErrorBoundary>
        </StrictMode>
    );
}
