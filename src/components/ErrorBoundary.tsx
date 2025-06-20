import React from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
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
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        <Typography variant="h6" color="error" gutterBottom>
                            Something went wrong.
                        </Typography>
                        {this.state.error && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {this.state.error.toString()}
                            </Typography>
                        )}
                    </Alert>
                    <Button variant="contained" color="primary" onClick={this.handleReload}>
                        Reload Page
                    </Button>
                </Box>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
