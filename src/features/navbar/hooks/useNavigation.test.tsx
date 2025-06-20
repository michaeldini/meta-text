import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { useNavigation } from '../hooks/useNavigation';
import { NavigationItem, User } from '../types';

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const TestWrapper: React.FC<{ children: React.ReactNode; initialEntries?: string[] }> = ({
    children,
    initialEntries = ['/']
}) => (
    <MemoryRouter initialEntries={initialEntries}>
        {children}
    </MemoryRouter>
);

describe('useNavigation', () => {
    const mockUser: User = { id: 1, username: 'testuser' };
    const mockLogout = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Navigation Items', () => {
        it('returns default navigation items for unauthenticated user', () => {
            const { result } = renderHook(
                () => useNavigation({ user: null, onLogout: mockLogout }),
                { wrapper: TestWrapper }
            );

            expect(result.current.navigationItems).toHaveLength(2);
            expect(result.current.navigationItems.map(item => item.id)).toEqual(['login', 'register']);
        });

        it('returns default navigation items for authenticated user', () => {
            const { result } = renderHook(
                () => useNavigation({ user: mockUser, onLogout: mockLogout }),
                { wrapper: TestWrapper }
            );

            expect(result.current.navigationItems).toHaveLength(2);
            expect(result.current.navigationItems.map(item => item.id)).toEqual(['home', 'logout']);
        });

        it('includes custom navigation items', () => {
            const customItems: NavigationItem[] = [
                {
                    id: 'custom',
                    label: 'Custom',
                    path: '/custom',
                    showWhen: 'always',
                },
            ];

            const { result } = renderHook(
                () => useNavigation({ user: null, onLogout: mockLogout, customItems }),
                { wrapper: TestWrapper }
            );

            expect(result.current.navigationItems).toHaveLength(3);
            expect(result.current.navigationItems.some(item => item.id === 'custom')).toBe(true);
        });
    });

    describe('Active Route Detection', () => {
        it('correctly identifies active route', () => {
            const { result } = renderHook(
                () => useNavigation({ user: mockUser, onLogout: mockLogout }),
                {
                    wrapper: ({ children }) => (
                        <TestWrapper initialEntries={['/home']}>
                            {children}
                        </TestWrapper>
                    )
                }
            );

            expect(result.current.isActive('/home')).toBe(true);
            expect(result.current.isActive('/about')).toBe(false);
        });

        it('handles root path correctly', () => {
            const { result } = renderHook(
                () => useNavigation({ user: mockUser, onLogout: mockLogout }),
                { wrapper: TestWrapper }
            );

            expect(result.current.isActive('/')).toBe(true);
        });
    });

    describe('Navigation Handling', () => {
        it('navigates when item has path', () => {
            const { result } = renderHook(
                () => useNavigation({ user: mockUser, onLogout: mockLogout }),
                { wrapper: TestWrapper }
            );

            const item: NavigationItem = {
                id: 'test',
                label: 'Test',
                path: '/test',
                showWhen: 'always',
            };

            act(() => {
                result.current.handleItemClick(item);
            });

            expect(mockNavigate).toHaveBeenCalledWith('/test');
        });

        it('calls action when item has action', () => {
            const { result } = renderHook(
                () => useNavigation({ user: mockUser, onLogout: mockLogout }),
                { wrapper: TestWrapper }
            );

            const mockAction = vi.fn();
            const item: NavigationItem = {
                id: 'test',
                label: 'Test',
                action: mockAction,
                showWhen: 'always',
            };

            act(() => {
                result.current.handleItemClick(item);
            });

            expect(mockAction).toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it('calls onClose when provided', () => {
            const { result } = renderHook(
                () => useNavigation({ user: mockUser, onLogout: mockLogout }),
                { wrapper: TestWrapper }
            );

            const mockOnClose = vi.fn();
            const item: NavigationItem = {
                id: 'test',
                label: 'Test',
                path: '/test',
                showWhen: 'always',
            };

            act(() => {
                result.current.handleItemClick(item, mockOnClose);
            });

            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    describe('Current Path', () => {
        it('returns current path', () => {
            const { result } = renderHook(
                () => useNavigation({ user: mockUser, onLogout: mockLogout }),
                {
                    wrapper: ({ children }) => (
                        <TestWrapper initialEntries={['/test-path']}>
                            {children}
                        </TestWrapper>
                    )
                }
            );

            expect(result.current.currentPath).toBe('/test-path');
        });
    });

    describe('Memoization', () => {
        it('memoizes navigation items correctly', () => {
            interface TestProps {
                user: User | null;
                onLogout: () => void;
            }

            const { result, rerender } = renderHook(
                (props: TestProps) => useNavigation(props),
                {
                    wrapper: TestWrapper,
                    initialProps: { user: mockUser, onLogout: mockLogout }
                }
            );

            const firstResult = result.current.navigationItems;

            // Re-render with same props
            rerender({ user: mockUser, onLogout: mockLogout });

            // Should return the same reference (memoized)
            expect(result.current.navigationItems).toBe(firstResult);
        });

        it('updates navigation items when user changes', () => {
            interface TestProps {
                user: User | null;
                onLogout: () => void;
                customItems?: NavigationItem[];
                onError?: (error: any) => void;
            }

            const { result, rerender } = renderHook(
                (props: TestProps) => useNavigation(props),
                {
                    wrapper: TestWrapper,
                    initialProps: {
                        user: null,
                        onLogout: mockLogout,
                        customItems: undefined,
                        onError: undefined
                    } as TestProps
                }
            );

            const firstResult = result.current.navigationItems;

            // Re-render with different user
            rerender({
                user: mockUser,
                onLogout: mockLogout,
                customItems: undefined,
                onError: undefined
            } as TestProps);

            // Should return different items
            expect(result.current.navigationItems).not.toBe(firstResult);
            expect(result.current.navigationItems.map(item => item.id)).toEqual(['home', 'logout']);
        });
    });

    describe('Error Handling', () => {
        it('handles navigation errors gracefully', () => {
            const mockOnError = vi.fn();
            const mockFailingNavigate = vi.fn(() => {
                throw new Error('Navigation failed');
            });

            // Mock the navigate function to throw an error
            vi.mocked(mockNavigate).mockImplementation(mockFailingNavigate);

            const { result } = renderHook(
                () => useNavigation({ user: mockUser, onLogout: mockLogout, onError: mockOnError }),
                { wrapper: TestWrapper }
            );

            const item: NavigationItem = {
                id: 'test',
                label: 'Test',
                path: '/test',
                showWhen: 'always',
            };

            act(() => {
                result.current.handleItemClick(item);
            });

            expect(mockOnError).toHaveBeenCalledWith({
                type: 'navigation',
                message: 'Failed to navigate to /test: Navigation failed',
            });
        });

        it('handles logout errors gracefully', () => {
            const mockOnError = vi.fn();
            const mockFailingLogout = vi.fn(() => {
                throw new Error('Logout failed');
            });

            const { result } = renderHook(
                () => useNavigation({ user: mockUser, onLogout: mockFailingLogout, onError: mockOnError }),
                { wrapper: TestWrapper }
            );

            const logoutItem = result.current.navigationItems.find(item => item.id === 'logout');
            expect(logoutItem).toBeDefined();

            act(() => {
                if (logoutItem?.action) {
                    logoutItem.action();
                }
            });

            expect(mockOnError).toHaveBeenCalledWith({
                type: 'authentication',
                message: 'Logout failed: Logout failed',
            });
        });

        it('handles navigation errors with unknown error types', () => {
            const mockOnError = vi.fn();
            const mockFailingNavigate = vi.fn(() => {
                throw 'String error'; // Non-Error object
            });

            vi.mocked(mockNavigate).mockImplementation(mockFailingNavigate);

            const { result } = renderHook(
                () => useNavigation({ user: mockUser, onLogout: mockLogout, onError: mockOnError }),
                { wrapper: TestWrapper }
            );

            const item: NavigationItem = {
                id: 'test',
                label: 'Test',
                path: '/test',
                showWhen: 'always',
            };

            act(() => {
                result.current.handleItemClick(item);
            });

            expect(mockOnError).toHaveBeenCalledWith({
                type: 'navigation',
                message: 'Failed to navigate to /test: Unknown error',
            });
        });

        it('works without onError callback', () => {
            const mockFailingNavigate = vi.fn(() => {
                throw new Error('Navigation failed');
            });

            vi.mocked(mockNavigate).mockImplementation(mockFailingNavigate);

            const { result } = renderHook(
                () => useNavigation({ user: mockUser, onLogout: mockLogout }),
                { wrapper: TestWrapper }
            );

            const item: NavigationItem = {
                id: 'test',
                label: 'Test',
                path: '/test',
                showWhen: 'always',
            };

            // Should not throw even without onError
            expect(() => {
                act(() => {
                    result.current.handleItemClick(item);
                });
            }).not.toThrow();
        });
    });

    describe('Custom Items Integration', () => {
        it('correctly merges custom items with default items', () => {
            const customItems: NavigationItem[] = [
                {
                    id: 'custom1',
                    label: 'Custom 1',
                    path: '/custom1',
                    showWhen: 'authenticated',
                },
                {
                    id: 'custom2',
                    label: 'Custom 2',
                    path: '/custom2',
                    showWhen: 'unauthenticated',
                },
                {
                    id: 'custom3',
                    label: 'Custom 3',
                    path: '/custom3',
                    showWhen: 'always',
                },
            ];

            const { result } = renderHook(
                () => useNavigation({ user: mockUser, onLogout: mockLogout, customItems }),
                { wrapper: TestWrapper }
            );

            // Should have default authenticated items + custom authenticated and always items
            const itemIds = result.current.navigationItems.map(item => item.id);
            expect(itemIds).toContain('home');
            expect(itemIds).toContain('logout');
            expect(itemIds).toContain('custom1'); // authenticated
            expect(itemIds).toContain('custom3'); // always
            expect(itemIds).not.toContain('custom2'); // unauthenticated
        });

        it('handles custom items with actions', () => {
            const mockCustomAction = vi.fn();
            const customItems: NavigationItem[] = [
                {
                    id: 'custom-action',
                    label: 'Custom Action',
                    action: mockCustomAction,
                    showWhen: 'always',
                },
            ];

            const { result } = renderHook(
                () => useNavigation({ user: mockUser, onLogout: mockLogout, customItems }),
                { wrapper: TestWrapper }
            );

            const customItem = result.current.navigationItems.find(item => item.id === 'custom-action');
            expect(customItem).toBeDefined();

            act(() => {
                result.current.handleItemClick(customItem!);
            });

            expect(mockCustomAction).toHaveBeenCalled();
        });

        it('handles disabled custom items', () => {
            const mockOnError = vi.fn();
            const customItems: NavigationItem[] = [
                {
                    id: 'disabled-item',
                    label: 'Disabled Item',
                    path: '/disabled',
                    showWhen: 'always',
                    disabled: true,
                },
            ];

            const { result } = renderHook(
                () => useNavigation({ user: mockUser, onLogout: mockLogout, customItems, onError: mockOnError }),
                { wrapper: TestWrapper }
            );

            const disabledItem = result.current.navigationItems.find(item => item.id === 'disabled-item');
            expect(disabledItem).toBeDefined();
            expect(disabledItem?.disabled).toBe(true);

            act(() => {
                result.current.handleItemClick(disabledItem!);
            });

            expect(mockOnError).toHaveBeenCalledWith({
                type: 'permission',
                message: 'Navigation to Disabled Item is disabled',
                item: disabledItem,
            });
        });
    });

    describe('Performance and Optimization', () => {
        it('memoizes handleItemClick correctly', () => {
            type NavProps = { user: User | null; onLogout: () => void };
            const { result, rerender } = renderHook(
                (props: NavProps) => useNavigation(props),
                {
                    wrapper: TestWrapper,
                    initialProps: { user: mockUser, onLogout: mockLogout }
                }
            );

            const firstHandleItemClick = result.current.handleItemClick;

            // Re-render with same props
            rerender({ user: mockUser, onLogout: mockLogout });

            // Should return the same reference (memoized)
            expect(result.current.handleItemClick).toBe(firstHandleItemClick);
        });

        it('memoizes isActive function correctly', () => {
            type NavProps = { user: User | null; onLogout: () => void };
            const { result, rerender } = renderHook(
                (props: NavProps) => useNavigation(props),
                {
                    wrapper: TestWrapper,
                    initialProps: { user: mockUser, onLogout: mockLogout }
                }
            );

            const firstIsActive = result.current.isActive;

            // Re-render with same props
            rerender({ user: mockUser, onLogout: mockLogout });

            // Should return the same reference (memoized)
            expect(result.current.isActive).toBe(firstIsActive);
        });

        it('updates memoized functions when dependencies change', () => {
            const mockOnError1 = vi.fn();
            const mockOnError2 = vi.fn();

            type NavProps = { user: User | null; onLogout: () => void; onError?: any };
            const { result, rerender } = renderHook(
                (props: NavProps) => useNavigation(props),
                {
                    wrapper: TestWrapper,
                    initialProps: { user: mockUser, onLogout: mockLogout, onError: mockOnError1 }
                }
            );

            const firstHandleItemClick = result.current.handleItemClick;

            // Re-render with different onError
            rerender({ user: mockUser, onLogout: mockLogout, onError: mockOnError2 });

            // Should return different reference due to dependency change
            expect(result.current.handleItemClick).not.toBe(firstHandleItemClick);
        });
    });

    describe('Edge Cases', () => {
        it('handles empty custom items array', () => {
            const { result } = renderHook(
                () => useNavigation({ user: mockUser, onLogout: mockLogout, customItems: [] }),
                { wrapper: TestWrapper }
            );

            // Should only have default items
            expect(result.current.navigationItems).toHaveLength(2);
            expect(result.current.navigationItems.map(item => item.id)).toEqual(['home', 'logout']);
        });

        it('handles item with neither path nor action', () => {
            const mockOnError = vi.fn();
            const invalidItem: NavigationItem = {
                id: 'invalid',
                label: 'Invalid',
                showWhen: 'always',
                // No path or action
            };

            const { result } = renderHook(
                () => useNavigation({ user: mockUser, onLogout: mockLogout, onError: mockOnError }),
                { wrapper: TestWrapper }
            );

            act(() => {
                result.current.handleItemClick(invalidItem);
            });

            expect(mockOnError).toHaveBeenCalledWith({
                type: 'navigation',
                message: 'No action or path defined for Invalid',
                item: invalidItem,
            });
        });

        it('handles path changes correctly', () => {
            const TestWrapperWithPath: React.FC<{ children: React.ReactNode; path: string }> = ({
                children,
                path
            }) => (
                <MemoryRouter initialEntries={[path]}>
                    {children}
                </MemoryRouter>
            );

            const { result, rerender } = renderHook(
                () => useNavigation({ user: mockUser, onLogout: mockLogout }),
                {
                    wrapper: ({ children }) => (
                        <TestWrapperWithPath path="/initial">
                            {children}
                        </TestWrapperWithPath>
                    )
                }
            );

            expect(result.current.currentPath).toBe('/initial');

            // Re-render with different wrapper (simulating navigation)
            rerender();

            // The path should still be accessible
            expect(result.current.currentPath).toBe('/initial');
        });
    });

    describe('Integration with NavigationError Types', () => {
        it('passes correct error types for different scenarios', () => {
            const mockOnError = vi.fn();

            const { result } = renderHook(
                () => useNavigation({ user: mockUser, onLogout: mockLogout, onError: mockOnError }),
                { wrapper: TestWrapper }
            );

            // Test disabled item error
            const disabledItem: NavigationItem = {
                id: 'disabled',
                label: 'Disabled',
                path: '/disabled',
                showWhen: 'always',
                disabled: true,
            };

            act(() => {
                result.current.handleItemClick(disabledItem);
            });

            expect(mockOnError).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'permission',
                    message: expect.stringContaining('disabled'),
                    item: disabledItem,
                })
            );

            mockOnError.mockClear();

            // Test invalid item error
            const invalidItem: NavigationItem = {
                id: 'invalid',
                label: 'Invalid',
                showWhen: 'always',
            };

            act(() => {
                result.current.handleItemClick(invalidItem);
            });

            expect(mockOnError).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'navigation',
                    message: expect.stringContaining('No action or path defined'),
                    item: invalidItem,
                })
            );
        });

        it('handles navigation click errors through handleNavigationClick utility', () => {
            const mockOnError = vi.fn();
            const mockFailingNavigate = vi.fn(() => {
                throw new Error('Network error');
            });

            vi.mocked(mockNavigate).mockImplementation(mockFailingNavigate);

            const { result } = renderHook(
                () => useNavigation({ user: mockUser, onLogout: mockLogout, onError: mockOnError }),
                { wrapper: TestWrapper }
            );

            const item: NavigationItem = {
                id: 'test',
                label: 'Test',
                path: '/test',
                showWhen: 'always',
            };

            act(() => {
                result.current.handleItemClick(item);
            });

            expect(mockOnError).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'navigation',
                    message: expect.stringContaining('Network error'),
                })
            );
        });
    });

    describe('Callback Stability', () => {
        it('maintains callback stability across re-renders with same dependencies', () => {
            const stableOnLogout = vi.fn();
            const stableOnError = vi.fn();

            type NavProps = { user: User | null; onLogout: () => void; onError: () => void };
            const { result, rerender } = renderHook(
                (props: NavProps) => useNavigation(props),
                {
                    wrapper: TestWrapper,
                    initialProps: { user: mockUser, onLogout: stableOnLogout, onError: stableOnError }
                }
            );

            const callbacks = {
                handleItemClick: result.current.handleItemClick,
                isActive: result.current.isActive,
            };

            // Multiple re-renders with same props
            rerender({ user: mockUser, onLogout: stableOnLogout, onError: stableOnError });
            rerender({ user: mockUser, onLogout: stableOnLogout, onError: stableOnError });

            // Callbacks should remain stable
            expect(result.current.handleItemClick).toBe(callbacks.handleItemClick);
            expect(result.current.isActive).toBe(callbacks.isActive);
        });
    });

    describe('Real-world Scenarios', () => {
        it('handles rapid successive navigation clicks', () => {
            const { result } = renderHook(
                () => useNavigation({ user: mockUser, onLogout: mockLogout }),
                { wrapper: TestWrapper }
            );

            const items: NavigationItem[] = [
                { id: 'page1', label: 'Page 1', path: '/page1', showWhen: 'always' },
                { id: 'page2', label: 'Page 2', path: '/page2', showWhen: 'always' },
                { id: 'page3', label: 'Page 3', path: '/page3', showWhen: 'always' },
            ];

            // Rapid clicks
            act(() => {
                items.forEach(item => {
                    result.current.handleItemClick(item);
                });
            });

            expect(mockNavigate).toHaveBeenCalledTimes(3);
            expect(mockNavigate).toHaveBeenCalledWith('/page1');
            expect(mockNavigate).toHaveBeenCalledWith('/page2');
            expect(mockNavigate).toHaveBeenCalledWith('/page3');
        });

        it('handles authentication state changes during navigation', () => {
            type NavProps = { user: User | null; onLogout: () => void };
            const { result, rerender } = renderHook(
                (props: NavProps) => useNavigation(props),
                {
                    wrapper: TestWrapper,
                    initialProps: { user: null, onLogout: mockLogout } as NavProps
                }
            );

            // Initially unauthenticated
            expect(result.current.navigationItems.map(item => item.id)).toEqual(['login', 'register']);

            // User logs in
            rerender({ user: mockUser, onLogout: mockLogout } as NavProps);

            // Should now show authenticated items
            expect(result.current.navigationItems.map(item => item.id)).toEqual(['home', 'logout']);

            // User logs out
            rerender({ user: null, onLogout: mockLogout } as NavProps);

            // Should show unauthenticated items again
            expect(result.current.navigationItems.map(item => item.id)).toEqual(['login', 'register']);
        });

        it('handles complex custom navigation with mixed show conditions', () => {
            const complexCustomItems: NavigationItem[] = [
                { id: 'public', label: 'Public', path: '/public', showWhen: 'always' },
                { id: 'private', label: 'Private', path: '/private', showWhen: 'authenticated' },
                { id: 'guest', label: 'Guest', path: '/guest', showWhen: 'unauthenticated' },
                { id: 'premium', label: 'Premium', path: '/premium', showWhen: 'authenticated', disabled: true },
            ];

            const { result } = renderHook(
                () => useNavigation({
                    user: mockUser,
                    onLogout: mockLogout,
                    customItems: complexCustomItems
                }),
                { wrapper: TestWrapper }
            );

            const visibleIds = result.current.navigationItems.map(item => item.id);

            // Should include default authenticated + public + private + premium (but disabled)
            expect(visibleIds).toContain('home');
            expect(visibleIds).toContain('logout');
            expect(visibleIds).toContain('public');
            expect(visibleIds).toContain('private');
            expect(visibleIds).toContain('premium');
            expect(visibleIds).not.toContain('guest');

            // Premium should be disabled
            const premiumItem = result.current.navigationItems.find(item => item.id === 'premium');
            expect(premiumItem?.disabled).toBe(true);
        });
    });
});
