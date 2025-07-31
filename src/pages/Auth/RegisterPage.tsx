import React, { useState, useEffect, FormEvent } from 'react';
import { Button } from '@chakra-ui/react/button';
import { Heading, Input } from '@chakra-ui/react';
import { PasswordInput, PasswordStrengthMeter } from "components";
import { Box } from '@chakra-ui/react/box';
import { Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from 'store';
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
        <Box display="flex" justifyContent="center">
            <Box>
                <Heading mb={4}>Register</Heading>
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
                        autoComplete="new-password"
                    />
                    {/* Optionally show password strength meter */}
                    <PasswordStrengthMeter value={password.length} max={16} mb={2} />
                    {error && <AppAlert severity="error">{error}</AppAlert>}
                    <Button
                        type="submit"
                        variant="solid"
                        colorScheme="blue"
                        loading={loading}
                        width="100%"
                        mt={2}
                    // disabled={true} // Todo: Enable when registration is open
                    >
                        Register (Currently closed. Come back later!)
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default RegisterPage;
