import { useAuthStore } from './authStore';
import * as authService from '../services/authService';
import { vi } from 'vitest';

describe('Auth Store', () => {
    beforeEach(() => {
        useAuthStore.setState({
            user: null,
            token: null,
            loading: false,
            error: null,
        });
    });

    it('should login successfully and update state', async () => {
        const mockToken = 'mockToken';
        const mockUser = { id: 1, username: 'testUser' };
        vi.spyOn(authService, 'login').mockResolvedValue({ access_token: mockToken, token_type: 'Bearer' });
        vi.spyOn(authService, 'getMe').mockResolvedValue(mockUser);

        const result = await useAuthStore.getState().login('testUser', 'password');

        expect(result).toBe(true);
        expect(useAuthStore.getState().user).toEqual(mockUser);
        expect(useAuthStore.getState().token).toBe(mockToken);
        expect(useAuthStore.getState().loading).toBe(false);
        expect(useAuthStore.getState().error).toBe(null);
    });

    it('should handle login failure and update state', async () => {
        vi.spyOn(authService, 'login').mockRejectedValue(new Error('Login failed'));

        const result = await useAuthStore.getState().login('testUser', 'password');

        expect(result).toBe(false);
        expect(useAuthStore.getState().user).toBe(null);
        expect(useAuthStore.getState().token).toBe(null);
        expect(useAuthStore.getState().loading).toBe(false);
        expect(useAuthStore.getState().error).toBe('Login failed');
    });

    it('should register successfully and update state', async () => {
        vi.spyOn(authService, 'register').mockResolvedValue({ id: 1, username: 'testUser' });

        const result = await useAuthStore.getState().register('testUser', 'password');

        expect(result).toBe(true);
        expect(useAuthStore.getState().loading).toBe(false);
        expect(useAuthStore.getState().error).toBe(null);
    });

    it('should handle registration failure and update state', async () => {
        vi.spyOn(authService, 'register').mockRejectedValue(new Error('Registration failed'));

        const result = await useAuthStore.getState().register('testUser', 'password');

        expect(result).toBe(false);
        expect(useAuthStore.getState().loading).toBe(false);
        expect(useAuthStore.getState().error).toBe('Registration failed');
    });

    it('should logout and clear state', () => {
        useAuthStore.setState({ user: { id: 1, username: 'testUser' }, token: 'mockToken' });

        useAuthStore.getState().logout();

        expect(useAuthStore.getState().user).toBe(null);
        expect(useAuthStore.getState().token).toBe(null);
        expect(useAuthStore.getState().error).toBe(null);
        expect(useAuthStore.getState().loading).toBe(false);
    });
});
