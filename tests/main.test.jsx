import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../src/styles/theme';
import { StrictMode } from 'react';
import { AppRoot } from '../src/main.tsx';
import { describe, it, expect } from 'vitest';

describe('main.jsx', () => {
    it('should export AppRoot and render without crashing', () => {
        const { container } = render(<AppRoot />);
        expect(container).toBeDefined();
    });
});
