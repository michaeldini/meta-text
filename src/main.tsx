import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ChakraProvider } from "./components/ui/provider"
import {
    // ChakraProvider,
    createSystem,
    defaultConfig
} from "@chakra-ui/react"
import config from "./styles/themes.chakra";

const system = createSystem(defaultConfig, config)

const queryClient = new QueryClient();

if (typeof document !== 'undefined' && document.getElementById('root')) {
    createRoot(document.getElementById('root')!).render(<AppRoot />);
}


export function AppRoot() {
    return (
        <StrictMode>
            <ErrorBoundary>
                <ChakraProvider>
                    <ThemeContextProvider>
                        <BrowserRouter>
                            <QueryClientProvider client={queryClient}>
                                <App />
                            </QueryClientProvider>
                        </BrowserRouter>
                    </ThemeContextProvider>
                </ChakraProvider>
            </ErrorBoundary>
        </StrictMode>
    );
}
