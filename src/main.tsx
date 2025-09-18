/**
 * 
 * Main entry point for the React application.
 * 
 * This file sets up the React application with necessary providers.
 * 
 * It includes:
 * - React StrictMode for highlighting potential problems.
 * - React Router's BrowserRouter for client-side routing.
 * - React Query's QueryClientProvider for managing server state.
 * - A custom Boundary component for error + loading handling.
 * - Global styles applied across the application.
 * 
 * The application is rendered into the DOM element with the ID 'root'.
 * 
 * Note: Ensure that the 'root' element exists in your HTML file.
 * 
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Boundary } from '@components/Boundaries';
import { globalStyles } from '@styles';


const queryClient = new QueryClient();

if (typeof document !== 'undefined' && document.getElementById('root')) {
    createRoot(document.getElementById('root')!).render(<AppRoot />);
}


export function AppRoot() {
    return (
        <StrictMode>
            <Boundary>
                <BrowserRouter>
                    <QueryClientProvider client={queryClient}>
                        {globalStyles()}
                        <App />
                    </QueryClientProvider>
                </BrowserRouter>
            </Boundary>
        </StrictMode>
    );
}
