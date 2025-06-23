import React, { useMemo } from 'react';
import { Paper, Typography, Box, CircularProgress, useTheme } from '@mui/material';
import { createFormStyles } from '../styles/styles';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { FORM_DEFAULTS } from '../constants';

interface CreateFormProps {
    description: string;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    children: React.ReactNode;
    error?: string | null;
    success?: string | null;
    loading?: boolean;
}

const CreateFormContainer: React.FC<CreateFormProps> = React.memo(({
    description,
    onSubmit,
    children,
    error,
    success,
    loading,
}) => {
    const theme = useTheme();
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');

    React.useEffect(() => {
        if (error) {
            setSnackbarMsg(error);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } else if (success) {
            setSnackbarMsg(success);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        }
    }, [error, success]);

    const handleSnackbarClose = React.useCallback((_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    }, []);

    // Theme-aware styles (NavBar pattern)
    const styles = useMemo(() => createFormStyles(theme), [theme]);

    return (
        <Paper elevation={3} sx={styles.paperStyles}>
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
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={FORM_DEFAULTS.SNACKBAR_AUTO_HIDE}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={styles.alertStyles}>
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </Paper>
    );
});

export default CreateFormContainer;
