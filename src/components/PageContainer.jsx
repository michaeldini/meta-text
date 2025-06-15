import React from 'react';
import { Container } from '@mui/material';

/**
 * Generic page container for consistent layout.
 * Wraps children in a centered, max-width Material UI Container.
 */
export default function PageContainer({ children }) {
    return (
        <Container maxWidth="lg" >
            {children}
        </Container>
    );
}
