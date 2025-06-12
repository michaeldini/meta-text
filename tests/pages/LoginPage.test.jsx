import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Move this mock to the top, before imports that use useNavigate
const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LoginPage from '../../src/pages/Auth/LoginPage';

// Use a variable to control the mock per test
const loginMock = vi.fn();
let errorMock = '';

vi.mock('../../src/store/authStore', () => ({
    useAuth: () => ({
        login: loginMock,
        loading: false,
        error: errorMock
    })
}));
vi.mock('../../src/utils/logger', () => ({
    __esModule: true,
    default: { info: vi.fn(), error: vi.fn() },
    info: vi.fn(),
    error: vi.fn()
}));


describe('LoginPage', () => {
    beforeEach(() => {
        loginMock.mockReset();
        errorMock = '';
        navigateMock.mockReset();
        vi.restoreAllMocks();
    });
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
        // Check for the heading (Typography variant h5)
        expect(screen.getByRole('heading', { name: /login/i, level: 5 })).toBeInTheDocument();
        expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        // Check for the login button
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });
    it('submits login form', async () => {
        loginMock.mockResolvedValue(true);
        renderWithRoute();
        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        expect(loginMock).toHaveBeenCalledWith('testuser', 'password123');
    });
    it('navigates to /metaText on successful login', async () => {
        loginMock.mockResolvedValue(true);
        renderWithRoute();
        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        await Promise.resolve();
        expect(navigateMock).toHaveBeenCalledWith('/metaText');
    });
    it('shows error message on login failure', async () => {
        loginMock.mockResolvedValue(false);
        errorMock = 'Login failed';
        renderWithRoute();
        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        expect(await screen.findByRole('alert')).toHaveTextContent('Login failed');
    });
    it('calls onLoginSuccess if login fails and onLoginSuccess is provided', async () => {
        const onLoginSuccess = vi.fn();
        render(
            <MemoryRouter>
                <LoginPage onLoginSuccess={onLoginSuccess} />
            </MemoryRouter>
        );
        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'failuser' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'failpass' } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        // Wait for async handleSubmit
        await Promise.resolve();
        expect(onLoginSuccess).toHaveBeenCalled();
    });
});
