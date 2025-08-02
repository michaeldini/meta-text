import React, { useState, FormEvent } from 'react';
import { Button } from '@chakra-ui/react/button';
import { Input } from '@chakra-ui/react/input';
import { Heading } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react/box';
import { useNavigate } from 'react-router-dom';
import {
    PasswordInput,
} from "@components/ui/password-input"
import { useAuthStore } from '@store/authStore';
import { AppAlert } from '@components/AppAlert';

export function LoginPage() {

    // get a function to login a user and the loading state from the auth store
    // also get the error state to show any login errors
    const login = useAuthStore(state => state.login);
    const loading = useAuthStore(state => state.loading);
    const error = useAuthStore(state => state.error);

    // local state for username and password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // handle form submission
    // this will call the login function from the auth store
    // and navigate to the home page on success
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const success = await login(username, password);
        if (success) {
            navigate('/');
        } else if (error) {
            // TODO: Optionally handle login errors here
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
                        autoComplete="username"
                    />
                    <PasswordInput
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        mb={3}
                        required
                        autoComplete="current-password"
                    />
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
