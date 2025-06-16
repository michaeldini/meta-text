/// <reference types="vitest" />
import './setupTests';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Simple static mock for useAuth
vi.mock('../store/authStore', () => ({
    useAuth: () => ({ user: null, logout: vi.fn() }),
}));

import NavBar from './NavBar';

describe('NavBar', () => {
    it('renders without crashing', () => {
        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );
        expect(screen.getByText('Meta-Text')).toBeInTheDocument();
    });

    it('shows login and register buttons when not authenticated', () => {
        render(
            <MemoryRouter>
                <NavBar />
            </MemoryRouter>
        );
        expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
    });
});
