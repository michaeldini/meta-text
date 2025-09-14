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
