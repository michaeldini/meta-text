import '../../../setupTests';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import NavBar from './NavBar';
import { NavigationItem } from '../types';

// Mock the auth store
const mockUser = { id: 1, username: 'testuser' };
const mockLogout = vi.fn();

vi.mock('../../../store/authStore', () => ({
    useAuth: vi.fn(),
}));

import { useAuth } from '../../../store/authStore';
const mockUseAuth = useAuth as any;

// Create theme for testing
const theme = createTheme();

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode; initialEntries?: string[] }> = ({
    children,
    initialEntries = ['/']
}) => (
    <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={initialEntries}>
            {children}
        </MemoryRouter>
    </ThemeProvider>
);

describe('NavBar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('renders with default brand name', () => {
            mockUseAuth.mockReturnValue({ user: null, logout: mockLogout });

            render(
                <TestWrapper>
                    <NavBar />
                </TestWrapper>
            );

            expect(screen.getByTestId('nav-brand')).toHaveTextContent('Meta-Text');
            expect(screen.getByTestId('nav-menu-button')).toBeInTheDocument();
        });

        it('renders with custom configuration', () => {
            mockUseAuth.mockReturnValue({ user: null, logout: mockLogout });

            const customConfig = {
                brand: { label: 'Custom App', path: '/custom' },
                items: [
                    {
                        id: 'custom-item',
                        label: 'Custom Item',
                        path: '/custom-path',
                        showWhen: 'always' as const,
                    },
                ],
            };

            render(
                <TestWrapper>
                    <NavBar config={customConfig} />
                </TestWrapper>
            );

            expect(screen.getByTestId('nav-brand')).toHaveTextContent('Custom App');
        });

        it('renders custom toolbar when provided', () => {
            mockUseAuth.mockReturnValue({ user: null, logout: mockLogout });

            const customToolbar = () => <div data-testid="custom-toolbar">Custom Toolbar</div>;

            render(
                <TestWrapper>
                    <NavBar renderToolbar={customToolbar} />
                </TestWrapper>
            );

            expect(screen.getByTestId('custom-toolbar')).toHaveTextContent('Custom Toolbar');
        });
    });

    describe('Authentication States', () => {
        it('shows unauthenticated menu items when user is not logged in', async () => {
            mockUseAuth.mockReturnValue({ user: null, logout: mockLogout });
            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <NavBar />
                </TestWrapper>
            );

            // Open menu
            await user.click(screen.getByTestId('nav-menu-button'));

            expect(screen.getByTestId('nav-item-login')).toBeInTheDocument();
            expect(screen.getByTestId('nav-item-register')).toBeInTheDocument();
            expect(screen.queryByTestId('nav-item-logout')).not.toBeInTheDocument();
            expect(screen.queryByTestId('nav-item-home')).not.toBeInTheDocument();
        });

        it('shows authenticated menu items when user is logged in', async () => {
            mockUseAuth.mockReturnValue({ user: mockUser, logout: mockLogout });
            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <NavBar />
                </TestWrapper>
            );

            // Open menu
            await user.click(screen.getByTestId('nav-menu-button'));

            expect(screen.getByTestId('nav-item-home')).toBeInTheDocument();
            expect(screen.getByTestId('nav-item-logout')).toBeInTheDocument();
            expect(screen.queryByTestId('nav-item-login')).not.toBeInTheDocument();
            expect(screen.queryByTestId('nav-item-register')).not.toBeInTheDocument();
        });
    });

    describe('Menu Interactions', () => {
        it('opens and closes menu correctly', async () => {
            mockUseAuth.mockReturnValue({ user: null, logout: mockLogout });
            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <NavBar />
                </TestWrapper>
            );

            const menuButton = screen.getByTestId('nav-menu-button');

            // Menu should be closed initially
            expect(screen.queryByTestId('nav-menu')).not.toBeInTheDocument();

            // Open menu
            await user.click(menuButton);
            expect(screen.getByTestId('nav-menu')).toBeInTheDocument();

            // Close menu by clicking outside (simulate)
            fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
        });

        it('calls logout when logout item is clicked', async () => {
            mockUseAuth.mockReturnValue({ user: mockUser, logout: mockLogout });
            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <NavBar />
                </TestWrapper>
            );

            // Open menu
            await user.click(screen.getByTestId('nav-menu-button'));

            // Click logout
            await user.click(screen.getByTestId('nav-item-logout'));

            expect(mockLogout).toHaveBeenCalledTimes(1);
        });

        it('navigates when menu item with path is clicked', async () => {
            mockUseAuth.mockReturnValue({ user: null, logout: mockLogout });
            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <NavBar />
                </TestWrapper>
            );

            // Open menu
            await user.click(screen.getByTestId('nav-menu-button'));

            // Click login item
            await user.click(screen.getByTestId('nav-item-login'));

            // Menu should close after navigation
            await waitFor(() => {
                expect(screen.queryByTestId('nav-menu')).not.toBeInTheDocument();
            });
        });
    });

    describe('Accessibility', () => {
        it('has proper ARIA attributes', () => {
            mockUseAuth.mockReturnValue({ user: null, logout: mockLogout });

            render(
                <TestWrapper>
                    <NavBar />
                </TestWrapper>
            );

            const menuButton = screen.getByTestId('nav-menu-button');

            expect(menuButton).toHaveAttribute('aria-label', 'Open navigation menu. Current brand: Meta-Text');
            expect(menuButton).toHaveAttribute('aria-haspopup', 'true');
            expect(menuButton).toHaveAttribute('aria-expanded', 'false');
        });

        it('updates ARIA attributes when menu is open', async () => {
            mockUseAuth.mockReturnValue({ user: null, logout: mockLogout });
            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <NavBar />
                </TestWrapper>
            );

            const menuButton = screen.getByTestId('nav-menu-button');

            // Open menu
            await user.click(menuButton);

            expect(menuButton).toHaveAttribute('aria-expanded', 'true');
            expect(menuButton).toHaveAttribute('aria-controls', 'navigation-menu');
        });

        it('supports keyboard navigation', async () => {
            mockUseAuth.mockReturnValue({ user: null, logout: mockLogout });
            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <NavBar />
                </TestWrapper>
            );

            // Focus on menu button
            const menuButton = screen.getByTestId('nav-menu-button');
            menuButton.focus();

            // Open menu with Enter key
            await user.keyboard('{Enter}');
            expect(screen.getByTestId('nav-menu')).toBeInTheDocument();

            // Close menu with Escape key
            await user.keyboard('{Escape}');
            await waitFor(() => {
                expect(screen.queryByTestId('nav-menu')).not.toBeInTheDocument();
            });
        });

        it('provides meaningful labels for menu items', async () => {
            mockUseAuth.mockReturnValue({ user: null, logout: mockLogout });
            const user = userEvent.setup();

            render(
                <TestWrapper>
                    <NavBar />
                </TestWrapper>
            );

            // Open menu
            await user.click(screen.getByTestId('nav-menu-button'));

            const loginItem = screen.getByTestId('nav-item-login');
            expect(loginItem).toHaveAttribute('aria-label', 'Login');
            expect(loginItem).toHaveAttribute('role', 'menuitem');
        });
    });

    describe('Active Route Highlighting', () => {
        it('highlights active menu item', async () => {
            mockUseAuth.mockReturnValue({ user: mockUser, logout: mockLogout });
            const user = userEvent.setup();

            render(
                <TestWrapper initialEntries={['/']}>
                    <NavBar />
                </TestWrapper>
            );

            // Open menu
            await user.click(screen.getByTestId('nav-menu-button'));

            const homeItem = screen.getByTestId('nav-item-home');
            expect(homeItem).toHaveClass('Mui-selected');
        });
    });

    describe('Custom Navigation Items', () => {
        it('renders custom navigation items', async () => {
            mockUseAuth.mockReturnValue({ user: null, logout: mockLogout });
            const user = userEvent.setup();

            const customItems: NavigationItem[] = [
                {
                    id: 'custom-1',
                    label: 'Custom Item 1',
                    path: '/custom-1',
                    showWhen: 'always',
                },
                {
                    id: 'custom-2',
                    label: 'Custom Item 2',
                    action: vi.fn(),
                    showWhen: 'always',
                    badge: '5',
                },
            ];

            const config = { items: customItems, brand: { label: 'Test', path: '/' } };

            render(
                <TestWrapper>
                    <NavBar config={config} />
                </TestWrapper>
            );

            // Open menu
            await user.click(screen.getByTestId('nav-menu-button'));

            expect(screen.getByTestId('nav-item-custom-1')).toBeInTheDocument();
            expect(screen.getByTestId('nav-item-custom-2')).toBeInTheDocument();
        });

        it('handles disabled menu items', async () => {
            mockUseAuth.mockReturnValue({ user: null, logout: mockLogout });
            const user = userEvent.setup();

            const customItems: NavigationItem[] = [
                {
                    id: 'disabled-item',
                    label: 'Disabled Item',
                    path: '/disabled',
                    showWhen: 'always',
                    disabled: true,
                },
            ];

            const config = { items: customItems, brand: { label: 'Test', path: '/' } };

            render(
                <TestWrapper>
                    <NavBar config={config} />
                </TestWrapper>
            );

            // Open menu
            await user.click(screen.getByTestId('nav-menu-button'));

            const disabledItem = screen.getByTestId('nav-item-disabled-item');
            expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
            expect(disabledItem).toHaveClass('Mui-disabled');
        });
    });

    describe('Error Handling', () => {
        it('handles missing auth gracefully', () => {
            mockUseAuth.mockReturnValue({ user: null, logout: undefined });

            expect(() => {
                render(
                    <TestWrapper>
                        <NavBar />
                    </TestWrapper>
                );
            }).not.toThrow();
        });
    });
});

