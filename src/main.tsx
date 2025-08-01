import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from "@components/ui/provider";
import { Boundary } from '@components/Boundaries';


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
                        <Provider>
                            <App />
                        </Provider>
                    </QueryClientProvider>
                </BrowserRouter>
            </Boundary>
        </StrictMode>
    );
}
