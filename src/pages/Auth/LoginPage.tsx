import React, { useState, useEffect, FormEvent } from 'react';
import { Button, Textarea, Box, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { log } from 'utils';
import { useAuthStore } from 'store';
import { AppAlert } from 'components';

interface LoginPageProps {
    onLoginSuccess?: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
    const login = useAuthStore(state => state.login);
    const loading = useAuthStore(state => state.loading);
    const error = useAuthStore(state => state.error);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

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
            <Box>
                <Text >Login</Text>
                <form onSubmit={handleSubmit}>
                    <Textarea
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        margin="normal"
                        required
                    />
                    <Textarea
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        margin="normal"
                        required
                    />
                    {error && <AppAlert severity="error">{error}</AppAlert>}
                    <Button
                        type="submit"
                        variant="ghost"
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default LoginPage;
