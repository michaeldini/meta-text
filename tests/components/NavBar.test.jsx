import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import theme from '../../src/styles/theme.js';
import NavBar from '../../src/components/NavBar.jsx';
import { AuthProvider } from '../../src/store/authStore.jsx';

describe('NavBar', () => {
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <AuthProvider>
                    <BrowserRouter>
                        <NavBar />
                    </BrowserRouter>
                </AuthProvider>
            </ThemeProvider>
        );
    });
});
