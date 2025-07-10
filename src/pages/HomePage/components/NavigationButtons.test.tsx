import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NavigationButtons from './NavigationButtons';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

describe('NavigationButtons', () => {
    it('renders the navigation buttons container', () => {
        render(
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <NavigationButtons styles={{}} />
                </ThemeProvider>
            </BrowserRouter>
        );
        const container = screen.getByRole('button', { name: /browse source documents/i });
        expect(container).toBeInTheDocument();
    });

    it('renders the Browse Source Documents button', () => {
        render(
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <NavigationButtons styles={{}} />
                </ThemeProvider>
            </BrowserRouter>
        );
        const sourceDocsButton = screen.getByTestId('navigate-to-source-docs');
        expect(sourceDocsButton).toBeInTheDocument();
    });

    it('renders the Browse MetaTexts button', () => {
        render(
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <NavigationButtons styles={{}} />
                </ThemeProvider>
            </BrowserRouter>
        );
        const metaTextsButton = screen.getByTestId('navigate-to-metatexts');
        expect(metaTextsButton).toBeInTheDocument();
    });
});
