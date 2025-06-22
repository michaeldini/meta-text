import React, { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../../store/authStore';
import { Button, TextField, Box, Typography, Alert, Paper, Zoom, Grow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import log from '../../utils/logger';

interface LoginPageProps {
    onLoginSuccess?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
    const { login, loading, error } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        log.info('LoginPage mounted');
        return () => log.info('LoginPage unmounted');
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            navigate('/');
        } else if (onLoginSuccess) {
            onLoginSuccess();
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Grow in={true} timeout={500}>
                <Paper elevation={3} sx={{ p: 4, minWidth: 320 }}>
                    <Typography variant="h5" mb={2}>Login</Typography>
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
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </Paper>
            </Grow>
        </Box>
    );
};

export default LoginPage;
