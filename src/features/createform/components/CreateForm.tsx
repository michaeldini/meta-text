import React from 'react';
import { Paper, Typography, Box, Alert, CircularProgress } from '@mui/material';
import { uploadFormInner } from '../styles/styles';

interface CreateFormProps {
    title: string;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    children: React.ReactNode;
    error?: string;
    success?: string;
    loading?: boolean;
}

const CreateFormContainer: React.FC<CreateFormProps> = ({
    title,
    onSubmit,
    children,
    error,
    success,
    loading,
}) => (
    <Paper elevation={3}>
        <Typography variant="h5" gutterBottom>
            {title}
        </Typography>
        <Box component="form" onSubmit={onSubmit} sx={uploadFormInner}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><CircularProgress size={24} /></Box>}
            {children}
        </Box>
    </Paper>
);

export default CreateFormContainer;
