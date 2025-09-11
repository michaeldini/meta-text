import React from 'react';
import { Box, Button, Text } from '@styles';
import type { Logger } from '../types/global';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

// Type-safe access to global logger
const getLogger = (): Logger | null => {
    if (typeof window !== 'undefined' && window.logger) {
        return window.logger;
    }
    return null;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ errorInfo });

        // Log error to external service if logger is available
        const logger = getLogger();
        if (logger) {
            logger.error('ErrorBoundary caught an error', error, errorInfo);
        }
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box css={{ color: 'inherit', padding: 16 }}>
                    <Text css={{ marginBottom: 12 }}>An unexpected error occurred. Please try reloading the page.</Text>
                    <Button tone="default" onClick={this.handleReload} size="sm">Reload Page</Button>
                </Box>
            );
        }
        return this.props.children;
    }
}

/**

/**
 * Combined boundary component for error and suspense handling.
 * Usage: <Boundary fallbackText="Loading data...">...</Boundary>
 */
type BoundaryProps = {
    children: React.ReactNode,
    fallback?: React.ReactNode,
    fallbackText?: string
};

export function Boundary({ children, fallback, fallbackText = "Loading..." }: BoundaryProps) {
    return (
        <ErrorBoundary>
            <React.Suspense
                fallback={
                    fallback || (
                        <Box css={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
                            <span style={{ fontSize: 32, color: '#aaa' }} aria-label="Loading...">⏳</span>
                            <Text as="span">{fallbackText}</Text>
                        </Box>
                    )
                }
            >
                {children}
            </React.Suspense>
        </ErrorBoundary>
    );
}

export { ErrorBoundary };
