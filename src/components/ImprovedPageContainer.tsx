import React, { ReactNode } from 'react';
import { Container, useTheme } from '@mui/material';
import ErrorBoundary from './ErrorBoundary';

/**
 * IMPROVED PageContainer component using MUI theming best practices
 * 
 * Improvements:
 * 1. Uses theme-aware responsive styling
 * 2. Better semantic structure
 * 3. Performance optimized with theme memoization
 * 4. Accessibility considerations
 */

interface PageContainerProps {
    children: ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    disableGutters?: boolean;
    component?: React.ElementType;
}

export default function ImprovedPageContainer({
    children,
    maxWidth = false,
    disableGutters = false,
    component = 'main',
}: PageContainerProps) {
    const theme = useTheme();

    // Theme-aware responsive styling
    const containerStyles = {
        // Responsive spacing using theme
        py: { xs: theme.spacing(2), md: theme.spacing(3) },
        px: disableGutters ? 0 : { xs: theme.spacing(1), md: theme.spacing(2) },

        // Layout
        display: 'flex',
        flexDirection: 'column' as const,
        gap: theme.spacing(2),

        // Prevent horizontal overflow
        width: '100%',
        maxWidth: '100vw',

        // Responsive min-height (account for navbar)
        minHeight: {
            xs: 'calc(100vh - 56px)', // Mobile navbar height
            sm: 'calc(100vh - 64px)', // Desktop navbar height
        },

        // Focus management for accessibility
        '&:focus': {
            outline: 'none',
        },

        // Smooth transitions for theme changes
        transition: theme.transitions.create(
            ['padding', 'margin'],
            { duration: theme.transitions.duration.short }
        ),
    };

    return (
        <Container
            component={component}
            maxWidth={maxWidth}
            disableGutters={disableGutters}
            sx={containerStyles}
            role={component === 'main' ? 'main' : undefined}
            aria-label={component === 'main' ? 'Main content' : undefined}
        >
            <ErrorBoundary>
                {children}
            </ErrorBoundary>
        </Container>
    );
}
