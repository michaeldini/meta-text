import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LoginPage from '../../src/pages/Auth/LoginPage';

vi.mock('../../src/store/authStore', () => ({
    useAuth: () => ({
        login: vi.fn().mockResolvedValue(true),
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


describe('LoginPage', () => {
    function renderWithRoute() {
        return render(
            <MemoryRouter initialEntries={["/login"]}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </MemoryRouter>
        );
    }

    it('renders login form', () => {
        renderWithRoute();
        // Check for the heading
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        // Check for the login button
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });
});
