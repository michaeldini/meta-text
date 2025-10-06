// AuthForm: Simple login/register form using Stitches primitives. No password strength meter.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Column,
    Heading,
    Input,
    BaseButton,
    Text,
} from '@styles';

interface AuthFormProps {
    type: 'login' | 'register';
    onSubmit: (data: { email: string; password: string }) => Promise<boolean>;
    error?: string;
    loading?: boolean;
    redirectOnSuccess?: string;
}

function AuthForm({ type, onSubmit, error, loading, redirectOnSuccess }: AuthFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        try {
            const success = await onSubmit({ email, password });
            if (success && redirectOnSuccess) {
                navigate(redirectOnSuccess);
            }
        } catch (err: unknown) {
            setFormError(err instanceof Error ? err.message : 'Something went wrong');
        }
    };

    return (
        <Box as="form" css={{ maxWidth: 350, margin: '40px auto 0', padding: 24, borderRadius: 8, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }} onSubmit={handleSubmit}>
            <Column>
                <Heading css={{ textAlign: 'center', marginBottom: 0 }}>{type === 'login' ? 'Login' : 'Register'}</Heading>
                <Input
                    type="text"
                    placeholder="Username"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                {(formError || error) && (
                    <Box>
                        <Text>{formError || error}</Text>
                    </Box>
                )}
                <BaseButton type="submit" tone="primary" disabled={loading} css={{ width: '100%' }}>
                    {loading ? (type === 'login' ? 'Logging in...' : 'Registering...') : type === 'login' ? 'Login' : 'Register'}
                </BaseButton>
            </Column>
        </Box>
    );
}

export default AuthForm;
