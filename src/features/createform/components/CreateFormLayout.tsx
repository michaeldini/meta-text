// CreateFormLayout is a presentational wrapper: it provides layout, loading, and feedback UI (snackbar, spinner, etc).
import React from 'react';
import { Paper, Typography, Box, CircularProgress, useTheme } from '@mui/material';
import { createFormStyles } from '../styles/styles';

interface CreateFormLayoutProps {
    title?: string;
    description: string;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    children: React.ReactNode;
    error?: string | null;
    success?: string | null;
    loading?: boolean;
}

const CreateFormLayout: React.FC<CreateFormLayoutProps> = ({
    title,
    description,
    onSubmit,
    children,
    error,
    success,
    loading,
}) => {
    const theme = useTheme();
    const styles = React.useMemo(() => createFormStyles(theme), [theme]);

    return (
        <Paper elevation={3} sx={styles.createFormContainer}>
            {title && <Typography variant="h6">{title}</Typography>}
            <Typography variant="body1" gutterBottom>{description}</Typography>
            <Box component="form" onSubmit={onSubmit} sx={styles.uploadFormInner}>
                {loading && (
                    <Box sx={styles.loadingBoxStyles}>
                        <CircularProgress sx={styles.spinnerStyles} />
                    </Box>
                )}
                {children}
            </Box>
        </Paper>
    );
};

export default React.memo(CreateFormLayout);
