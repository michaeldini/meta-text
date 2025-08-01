import React from 'react';
import { Box } from '@chakra-ui/react/box';
import { Button } from '@chakra-ui/react/button';
import { Text, Spinner } from '@chakra-ui/react';
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
                <Box color="fg">
                    <Text>
                        An unexpected error occurred. Please try reloading the page.
                    </Text>
                    <Button
                        variant="ghost"
                        onClick={this.handleReload}
                        color="fg"
                    >
                        Reload Page
                    </Button>
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

export const Boundary: React.FC<BoundaryProps> = ({ children, fallback, fallbackText = "Loading..." }) => (
    <ErrorBoundary>
        <React.Suspense
            fallback={
                fallback || (
                    <span>
                        <Spinner aria-label="Loading..." />
                        <Text as="span">{fallbackText}</Text>
                    </span>
                )
            }
        >
            {children}
        </React.Suspense>
    </ErrorBoundary>
);

export { ErrorBoundary };
