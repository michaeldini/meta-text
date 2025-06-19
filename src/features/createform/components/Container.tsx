import React from 'react';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import { uploadFormInner } from '../styles/styles';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface CreateFormProps {
    description: string;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    children: React.ReactNode;
    error?: string;
    success?: string;
    loading?: boolean;
}

const CreateFormContainer: React.FC<CreateFormProps> = ({
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

    const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    return (
        <Paper elevation={3} sx={{ minHeight: '400px' }}>
            <Typography variant="body1" gutterBottom>
                {description}
            </Typography>
            <Box component="form" onSubmit={onSubmit} sx={uploadFormInner}>
                {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><CircularProgress size={24} /></Box>}
                {children}
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default CreateFormContainer;
