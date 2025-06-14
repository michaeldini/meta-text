import React from 'react';
import { Container } from '@mui/material';

/**
 * Generic entity manager page for list/create/delete/search pattern.
 *
 * Now uses children for all content, making it a pure layout shell.
 */
export default function EntityManagerPage({ children }) {
    return (
        <Container sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
            {children}
        </Container>
    );
}
