import React, { ReactNode } from 'react';
import { Container } from '@mui/material';
import { pageContainer } from '../styles/pageStyles';

/**
 * Generic page container for consistent layout.
 * Wraps children in a centered, max-width Material UI Container.
 */
export default function PageContainer({ children }: { children: ReactNode }) {
    return (
        <Container maxWidth="lg" sx={pageContainer}>
            {children}
        </Container>
    );
}
