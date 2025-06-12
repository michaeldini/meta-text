import { describe, it, expect, afterEach, vi } from 'vitest';
import { register, login, getMe } from '../../src/services/authService';
import handleApiResponse from '../../src/utils/api';

vi.mock('../../src/utils/api', () => ({
    __esModule: true,
    default: vi.fn()
}));

globalThis.fetch = vi.fn();

describe('authService', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('register calls fetch with POST and handleApiResponse', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce({ id: 1, username: 'user' });
        const result = await register({ username: 'user', password: 'pass' });
        expect(fetch).toHaveBeenCalledWith('/api/auth/register', expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'user', password: 'pass' })
        }));
        expect(handleApiResponse).toHaveBeenCalledWith('response', 'Registration failed');
        expect(result).toEqual({ id: 1, username: 'user' });
    });

    it('login calls fetch with POST and handleApiResponse', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce({ access_token: 'token' });
        const result = await login({ username: 'user', password: 'pass' });
        expect(fetch).toHaveBeenCalledWith('/api/auth/token', expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: expect.any(URLSearchParams)
        }));
        expect(handleApiResponse).toHaveBeenCalledWith('response', 'Login failed');
        expect(result).toEqual({ access_token: 'token' });
    });

    it('getMe calls fetch with Authorization header and handleApiResponse', async () => {
        fetch.mockResolvedValueOnce('response');
        handleApiResponse.mockResolvedValueOnce({ id: 2, username: 'me' });
        const result = await getMe('sometoken');
        expect(fetch).toHaveBeenCalledWith('/api/auth/me', {
            headers: { 'Authorization': 'Bearer sometoken' }
        });
        expect(handleApiResponse).toHaveBeenCalledWith('response', 'Failed to fetch user info');
        expect(result).toEqual({ id: 2, username: 'me' });
    });
});
