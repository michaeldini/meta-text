// CreateFormContainer is a "dumb" presentational wrapper: it provides layout, loading, and feedback UI (snackbar, spinner, etc).
import React, { useMemo } from 'react';
import { Paper, Typography, Box, CircularProgress, useTheme } from '@mui/material';
import ErrorBoundary from '../../../components/ErrorBoundary';
import LoadingBoundary from '../../../components/LoadingBoundary';
import { createFormStyles } from '../styles/styles';

interface CreateFormProps {
    title?: string; // Optional title prop
    description: string;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    children: React.ReactNode;
    error?: string | null;
    success?: string | null;
    loading?: boolean;
    sourceDocsLoading?: boolean; // for loading boundary
    sourceDocsError?: any; // for error boundary
}

const CreateFormContainer: React.FC<CreateFormProps> = React.memo(({
    title,
    description,
    onSubmit,
    children,
    error,
    success,
    loading,
    sourceDocsLoading,
    sourceDocsError,
}) => {
    const theme = useTheme();
    const styles = useMemo(() => createFormStyles(theme), [theme]);

    return (
        <ErrorBoundary>
            <LoadingBoundary loading={!!(sourceDocsLoading || loading)}>
                <Paper elevation={3} sx={styles.createFormContainer}>
                    {title && (
                        <Typography variant="h6">{title}</Typography>
                    )}
                    <Typography variant="body1" gutterBottom>
                        {description}
                    </Typography>
                    <Box component="form" onSubmit={onSubmit} sx={styles.uploadFormInner}>
                        {loading && (
                            <Box sx={styles.loadingBoxStyles}>
                                <CircularProgress sx={styles.spinnerStyles} />
                            </Box>
                        )}
                        {children}
                    </Box>
                </Paper>
            </LoadingBoundary>
        </ErrorBoundary>
    );
});

export default CreateFormContainer;
