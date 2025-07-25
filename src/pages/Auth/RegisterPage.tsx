import React, { useState, useEffect, FormEvent } from 'react';
import { Button, TextField, Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from 'store';
import { log } from 'utils';
import { AppAlert } from 'components';

interface RegisterPageProps {
    onRegisterSuccess?: () => void;
}

export function RegisterPage({ onRegisterSuccess }: RegisterPageProps) {
    const register = useAuthStore(state => state.register);
    const loading = useAuthStore(state => state.loading);
    const error = useAuthStore(state => state.error);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        log.info('RegisterPage mounted');
        return () => log.info('RegisterPage unmounted');
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const success = await register(username, password);
        if (success) {
            navigate('/login');
        } else if (onRegisterSuccess) {
            onRegisterSuccess();
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
                <Typography variant="h5" mb={2}>Register</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                    />
                    {error && <AppAlert severity="error">{error}</AppAlert>}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        // disable button while still in development to prevent accidental registrations
                        disabled={loading}
                    // disabled={true}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default RegisterPage;
