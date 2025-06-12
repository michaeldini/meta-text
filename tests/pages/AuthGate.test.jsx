import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AuthGate from '../../src/pages/Auth/AuthGate';


let mockUser = null;
vi.mock('../../src/store/authStore', () => ({
    useAuth: () => ({ user: mockUser })
}));
vi.mock('../../src/pages/Auth/LoginPage', () => ({ default: () => <div data-testid="login-page" /> }));


describe('AuthGate', () => {
    it('renders LoginPage if not authenticated', () => {
        render(<AuthGate>children</AuthGate>);
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
    it('renders children if authenticated', () => {
        mockUser = { id: 1, name: 'Test User' };
        render(<AuthGate>children</AuthGate>);
        expect(screen.getByText('children')).toBeInTheDocument();
    });
    it('renders LoginPage if user is null', () => {
        mockUser = null;
        render(<AuthGate>children</AuthGate>);
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
    }
    );
});
