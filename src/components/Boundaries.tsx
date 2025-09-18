import React from 'react';
import { Box, Button, Spinner, Text } from '@styles';
import log from '@utils/logger';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

/**
 * ErrorBoundary is a React error boundary component.
 *
 * It catches JavaScript errors anywhere in its child component tree, logs those
 * errors using the application logger, and displays a simple fallback UI that
 * allows the user to reload the page.
 *
 * Usage:
 * const App = () => (
 *   <ErrorBoundary>
 *     <YourComponent />
 *   </ErrorBoundary>
 * );
 *
 * Behavior:
 * - getDerivedStateFromError sets local state to render the fallback UI.
 * - componentDidCatch records additional error info and sends the error to the logger.
 * - handleReload performs a full page reload to attempt recovery.
 *
 * Notes:
 * - This boundary is intended for top-level UI error handling; business logic
 *   errors should be handled closer to where they occur.
 * - Errors are not suppressed silently — they are logged via the central logger.
 */
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

        // Log error using the main logging system
        log.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box>
                    <Text css={{ marginBottom: 12 }}>An unexpected error occurred. Please try reloading the page.</Text>
                    <Button tone="default" onClick={this.handleReload} >Reload Page</Button>
                </Box>
            );
        }
        return this.props.children;
    }
}


type BoundaryProps = {
    children: React.ReactNode,
    fallback?: React.ReactNode,
    fallbackText?: string
};

/**
 * Boundary component that wraps children with an ErrorBoundary and React.Suspense.
 *
 * The ErrorBoundary will catch rendering errors in the tree and show a simple reload
 * UI. React.Suspense is used to display a loading fallback while children are resolving.
 *
 * @param children - The content to render within the boundary.
 * @param fallback - Optional React node to display while the children are suspended.
 *                   If omitted, a centered spinner and text will be shown.
 * @param fallbackText - Optional loading text displayed alongside the default spinner
 *                       fallback. Defaults to "Loading...".
 * @returns A React element that provides error handling and suspense fallback for its children.
 */
export function Boundary({ children, fallback, fallbackText = "Loading..." }: BoundaryProps) {
    return (
        <ErrorBoundary>
            <React.Suspense
                fallback={
                    fallback || (
                        <Box css={{ textAlign: 'center', padding: 200 }}>
                            <Spinner />
                            <Text>{fallbackText}</Text>
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
