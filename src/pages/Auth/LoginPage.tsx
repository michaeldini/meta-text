import React, { useState, FormEvent } from 'react';
import { Button } from '@chakra-ui/react/button';
import { Input } from '@chakra-ui/react/input';
import { Heading } from '@chakra-ui/react/typography';
import { Box } from '@chakra-ui/react/box';
import { useNavigate } from 'react-router-dom';
import {
    PasswordInput,
} from "components"
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
        <Box display="flex" justifyContent="center">
            <Box>
                <Heading mb={4}>Login</Heading>
                <form onSubmit={handleSubmit}>
                    <Input
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        mb={3}
                        required
                        autoFocus
                    />
                    <PasswordInput
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        mb={3}
                        required
                    />
                    {/* Optionally show password strength meter */}

                    {error && <AppAlert severity="error">{error}</AppAlert>}
                    <Button
                        type="submit"
                        variant="solid"
                        colorScheme="blue"
                        loading={loading}
                        width="100%"
                        mt={2}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default LoginPage;
