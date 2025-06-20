import { describe, it, expect, vi } from 'vitest';
import {
    createDefaultNavigationItems,
    filterNavigationItems,
    isActiveRoute,
    handleNavigationClick,
    DEFAULT_ROUTES,
} from '../utils/navigation';
import { NavigationItem, User, NavigationError } from '../types';

describe('Navigation Utils', () => {
    const mockNavigate = vi.fn();
    const mockLogout = vi.fn();
    const mockUser: User = { id: 1, username: 'testuser' };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createDefaultNavigationItems', () => {
        it('creates correct default navigation items', () => {
            const items = createDefaultNavigationItems(mockNavigate, mockLogout);

            expect(items).toHaveLength(4);
            expect(items[0]).toEqual({
                id: 'home',
                label: 'Home',
                path: DEFAULT_ROUTES.HOME,
                showWhen: 'authenticated',
            });
            expect(items[1]).toEqual({
                id: 'login',
                label: 'Login',
                path: DEFAULT_ROUTES.LOGIN,
                showWhen: 'unauthenticated',
            });
            expect(items[2]).toEqual({
                id: 'register',
                label: 'Register',
                path: DEFAULT_ROUTES.REGISTER,
                showWhen: 'unauthenticated',
            });
            expect(items[3]).toEqual({
                id: 'logout',
                label: 'Logout',
                action: mockLogout,
                showWhen: 'authenticated',
            });
        });
    });

    describe('filterNavigationItems', () => {
        const mockItems: NavigationItem[] = [
            { id: '1', label: 'Home', path: '/', showWhen: 'authenticated' },
            { id: '2', label: 'Login', path: '/login', showWhen: 'unauthenticated' },
            { id: '3', label: 'About', path: '/about', showWhen: 'always' },
            { id: '4', label: 'Invalid', path: '/invalid', showWhen: 'invalid' as any },
        ];

        it('filters items for authenticated user', () => {
            const filtered = filterNavigationItems(mockItems, mockUser);

            expect(filtered).toHaveLength(2);
            expect(filtered.map(item => item.id)).toEqual(['1', '3']);
        });

        it('filters items for unauthenticated user', () => {
            const filtered = filterNavigationItems(mockItems, null);

            expect(filtered).toHaveLength(2);
            expect(filtered.map(item => item.id)).toEqual(['2', '3']);
        });

        it('handles invalid showWhen values', () => {
            const filtered = filterNavigationItems(mockItems, mockUser);

            // Should not include the item with invalid showWhen value
            expect(filtered.every(item => item.id !== '4')).toBe(true);
        });
    });

    describe('isActiveRoute', () => {
        it('returns true for exact path match', () => {
            expect(isActiveRoute('/home', '/home')).toBe(true);
        });

        it('returns true for path that starts with item path', () => {
            expect(isActiveRoute('/home/sub', '/home')).toBe(true);
        });

        it('returns false for different paths', () => {
            expect(isActiveRoute('/about', '/home')).toBe(false);
        });

        it('returns false when item path is undefined', () => {
            expect(isActiveRoute('/home', undefined)).toBe(false);
        });

        it('handles root path correctly', () => {
            expect(isActiveRoute('/', '/')).toBe(true);
            expect(isActiveRoute('/home', '/')).toBe(false); // Root should not match /home
        });

        it('should handle nested routes correctly', () => {
            expect(isActiveRoute('/app/settings/profile', '/app')).toBe(true);
            expect(isActiveRoute('/app/settings', '/app')).toBe(true);
            expect(isActiveRoute('/application', '/app')).toBe(false); // Partial match
        });

        it('should handle root path correctly', () => {
            expect(isActiveRoute('/', '/')).toBe(true);
            expect(isActiveRoute('/home', '/')).toBe(false);
        });
    });

    describe('handleNavigationClick', () => {
        const mockClose = vi.fn();

        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('navigates when item has path', () => {
            const item: NavigationItem = {
                id: '1',
                label: 'Home',
                path: '/home',
                showWhen: 'always',
            };

            handleNavigationClick(item, mockNavigate, mockClose);

            expect(mockNavigate).toHaveBeenCalledWith('/home');
            expect(mockClose).toHaveBeenCalled();
        });

        it('calls action when item has action', () => {
            const mockAction = vi.fn();
            const item: NavigationItem = {
                id: '1',
                label: 'Logout',
                action: mockAction,
                showWhen: 'always',
            };

            handleNavigationClick(item, mockNavigate, mockClose);

            expect(mockAction).toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalled();
            expect(mockClose).toHaveBeenCalled();
        });

        it('does nothing when item is disabled', () => {
            const item: NavigationItem = {
                id: '1',
                label: 'Disabled',
                path: '/disabled',
                showWhen: 'always',
                disabled: true,
            };

            handleNavigationClick(item, mockNavigate, mockClose);

            expect(mockNavigate).not.toHaveBeenCalled();
            expect(mockClose).not.toHaveBeenCalled();
        });

        it('works without onClose callback', () => {
            const item: NavigationItem = {
                id: '1',
                label: 'Home',
                path: '/home',
                showWhen: 'always',
            };

            expect(() => {
                handleNavigationClick(item, mockNavigate);
            }).not.toThrow();

            expect(mockNavigate).toHaveBeenCalledWith('/home');
        });

        it('should handle error when no path or action is provided', () => {
            const mockOnError = vi.fn();
            const item: NavigationItem = {
                id: 'invalid',
                label: 'Invalid',
                showWhen: 'always',
                // No path or action
            };

            handleNavigationClick(item, mockNavigate, undefined, mockOnError);

            expect(mockOnError).toHaveBeenCalledWith({
                type: 'navigation',
                message: 'No action or path defined for Invalid',
                item,
            });
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it('should handle disabled items', () => {
            const mockOnError = vi.fn();
            const item: NavigationItem = {
                id: 'disabled',
                label: 'Disabled',
                path: '/disabled',
                showWhen: 'always',
                disabled: true,
            };

            handleNavigationClick(item, mockNavigate, undefined, mockOnError);

            expect(mockOnError).toHaveBeenCalledWith({
                type: 'permission',
                message: 'Navigation to Disabled is disabled',
                item,
            });
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it('should handle navigation errors', () => {
            const mockOnError = vi.fn();
            const mockFailingNavigate = vi.fn(() => {
                throw new Error('Navigation failed');
            });

            const item: NavigationItem = {
                id: 'home',
                label: 'Home',
                path: '/home',
                showWhen: 'always',
            };

            handleNavigationClick(item, mockFailingNavigate, undefined, mockOnError);

            expect(mockOnError).toHaveBeenCalledWith({
                type: 'navigation',
                message: 'Failed to navigate: Navigation failed',
                item,
            });
        });
    });
});
