import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from '../../src/pages/Auth/RegisterPage';

vi.mock('../../src/store/authStore', () => ({
    useAuth: () => ({
        register: vi.fn().mockResolvedValue(true),
        loading: false,
        error: ''
    })
}));
vi.mock('../../src/utils/logger', () => ({
    __esModule: true,
    default: { info: vi.fn(), error: vi.fn() },
    info: vi.fn(),
    error: vi.fn()
}));

describe('RegisterPage', () => {
    it('renders register form', () => {
        render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        );
        expect(screen.getByRole('heading', { name: /register/i, level: 5 })).toBeInTheDocument();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });
});
