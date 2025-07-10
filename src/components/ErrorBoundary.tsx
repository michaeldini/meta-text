import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import type { Logger } from '../types/global';
import { AppAlert } from 'components';

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
                <Box sx={{ textAlign: 'center' }}>
                    <AppAlert severity="error" title="Something went wrong.">
                        <Typography variant="body1" color="text.secondary">
                            An unexpected error occurred. Please try reloading the page.
                        </Typography>
                    </AppAlert>
                    <Button
                        variant="contained"
                        onClick={this.handleReload}
                        sx={{ mt: 2 }}
                    >
                        Reload Page
                    </Button>
                </Box>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
