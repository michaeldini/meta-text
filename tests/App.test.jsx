import { render, screen } from '@testing-library/react';
import App from '../src/App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import theme from '../src/styles/theme';
import { AuthProvider } from '../src/store/authStore.tsx';

describe('App', () => {
    it('renders without crashing and shows welcome message on root', () => {
        render(
            <ThemeProvider theme={theme}>
                <AuthProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </AuthProvider>
            </ThemeProvider>
        );
        expect(screen.getByText(/Welcome to Meta-Text/i)).toBeInTheDocument();
    });
});
