// Reusable auth form for login and registration pages.
// Encapsulates shared UI (username/password inputs, strength meter, error, shake animation)
// and submission flow. Pages pass the auth action, labels, and redirect route.

import React, { useState, FormEvent } from 'react';

import { Box } from '@chakra-ui/react/box';
import { Heading } from '@chakra-ui/react/heading';
import { Input } from '@chakra-ui/react/input';
import { Button } from '@chakra-ui/react/button';
import { PasswordInput, PasswordStrengthMeter } from '@components/ui/password-input';
import { ErrorAlert } from '@components/ErrorAlert';
import { useNavigate } from 'react-router-dom';

export type AuthFormProps = {
    title: string;
    submitText: string;
    authAction: (username: string, password: string) => Promise<boolean>;
    redirectOnSuccess: string;
    loading: boolean;
    error?: string | null;
    disabled?: boolean;
    usernameAutoComplete?: string; // e.g., 'username'
    passwordAutoComplete?: string; // 'current-password' | 'new-password'
    errorTestId?: string;
};

export function AuthForm({
    title,
    submitText,
    authAction,
    redirectOnSuccess,
    loading,
    error,
    disabled = false,
    usernameAutoComplete = 'username',
    passwordAutoComplete = 'current-password',
    errorTestId,
}: AuthFormProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [shakeAnim, setShakeAnim] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const success = await authAction(username, password);
        if (success) {
            setPassword('');
            navigate(redirectOnSuccess);
        } else if (error) {
            setPassword('');
            setShakeAnim(true);
            setTimeout(() => setShakeAnim(false), 600);
        }
    };

    return (
        <Box display="flex" justifyContent="center">
            <Box animation={shakeAnim ? `shakeX 0.6s` : undefined}>
                <Heading mb={4}>{title}</Heading>
                <form onSubmit={handleSubmit}>
                    <Input
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        mb={3}
                        required
                        autoFocus
                        autoComplete={usernameAutoComplete}
                    />
                    <PasswordInput
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        mb={3}
                        required
                        autoComplete={passwordAutoComplete}
                    />
                    <PasswordStrengthMeter value={password.length} max={16} mb={2} />
                    <ErrorAlert message={error ?? undefined} data-testid={errorTestId} mt={2} />
                    <Button
                        type="submit"
                        variant="solid"
                        colorScheme="blue"
                        loading={loading}
                        width="100%"
                        mt={2}
                        disabled={disabled || loading}
                    >
                        {submitText}
                    </Button>
                </form>
            </Box>
        </Box>
    );
}

export default AuthForm;
