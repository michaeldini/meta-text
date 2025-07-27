import React, { useState, useEffect, FormEvent } from 'react';
import { Button } from '@chakra-ui/react/button';
import { Textarea } from '@chakra-ui/react/textarea';
import { Box } from '@chakra-ui/react/box';
import { Text } from '@chakra-ui/react';
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
            <Box>
                <Text >Register</Text>
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
                        // type="password"
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
                        // disable button while still in development to prevent accidental registrations
                        // disabled={loading}
                        disabled={true}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default RegisterPage;
