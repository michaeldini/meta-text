import React, { useState, FormEvent } from 'react';
import { Button } from '@chakra-ui/react/button';
import { Heading } from '@chakra-ui/react/heading';
import { Input } from '@chakra-ui/react/input';
import { PasswordInput, PasswordStrengthMeter } from "@components/ui/password-input";
import { Box } from '@chakra-ui/react/box';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@store/authStore';
import { AppAlert } from '@components/AppAlert';



export function RegisterPage() {

    // get a function to register a user and the loading state from the auth store
    // also get the error state to show any registration errors
    const register = useAuthStore(state => state.register);
    const loading = useAuthStore(state => state.loading);
    const error = useAuthStore(state => state.error);

    // local state for username and password input
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // use navigate from react-router to redirect after registration
    const navigate = useNavigate();


    // handle form submission
    // this will call the register function from the auth store
    // and redirect to the login page on success
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const success = await register(username, password);
        if (success) {
            navigate('/login');
        } else if (error) {
            // TODO: Optionally handle registration errors here
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
