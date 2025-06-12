import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../src/styles/theme';
import { StrictMode } from 'react';
import main from '../src/main.jsx';
import { describe, it, expect } from 'vitest';

// describe('main.jsx', () => {
//     it('should be defined and export something', () => {
//         expect(main).toBeDefined();
//     });
// });
