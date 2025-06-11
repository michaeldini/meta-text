import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AuthGate from '../../src/pages/Auth/AuthGate';

vi.mock('../../src/store/authStore', () => ({
    useAuth: () => ({ user: null })
}));
vi.mock('../../src/pages/Auth/LoginPage', () => ({ default: () => <div data-testid="login-page" /> }));
vi.mock('../../src/utils/logger', () => ({
    __esModule: true,
    default: { info: vi.fn(), error: vi.fn() }
}));

describe('AuthGate', () => {
    it('renders LoginPage if not authenticated', () => {
        render(<AuthGate>children</AuthGate>);
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
});
