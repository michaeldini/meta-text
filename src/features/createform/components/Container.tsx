import React from 'react';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import { uploadFormInner } from '../styles/styles';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { FORM_STYLES, FORM_DEFAULTS } from '../constants';

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

    const paperStyles = {
        minHeight: FORM_STYLES.MIN_CONTAINER_HEIGHT
    };

    const loadingBoxStyles = {
        display: 'flex',
        justifyContent: 'center',
        mt: FORM_STYLES.FORM_SPACING
    };

    const spinnerStyles = {
        size: FORM_STYLES.LOADING_SPINNER_SIZE
    };

    const alertStyles = {
        width: '100%'
    };

    return (
        <Paper elevation={3} sx={paperStyles}>
            <Typography variant="body1" gutterBottom>
                {description}
            </Typography>
            <Box component="form" onSubmit={onSubmit} sx={uploadFormInner}>
                {loading && (
                    <Box sx={loadingBoxStyles}>
                        <CircularProgress sx={spinnerStyles} />
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
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={alertStyles}>
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </Paper>
    );
});

export default CreateFormContainer;
