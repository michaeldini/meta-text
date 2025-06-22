import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import NavBar from './NavBar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';

const mockConfig = {
    brand: { label: 'Test Brand', path: '/' },
    items: [
        { id: 'home', label: 'Home', path: '/', showWhen: 'always' as const },
        { id: 'about', label: 'About', path: '/about', showWhen: 'always' as const },
    ],
};

const mockRenderToolbar = vi.fn(() => <div data-testid="custom-toolbar">Custom Toolbar</div>);
const mockToggleMode = vi.fn();

vi.mock('../../../contexts/ThemeContext', () => ({
    useThemeContext: () => ({ toggleMode: mockToggleMode }),
}));

const renderNavBar = (props = {}) => {
    const theme = createTheme();
    return render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <NavBar config={mockConfig} renderToolbar={mockRenderToolbar} {...props} />
            </BrowserRouter>
        </ThemeProvider>
    );
};

describe('NavBar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the brand button with correct label', () => {
        renderNavBar();

        const brandButton = screen.getByTestId('nav-brand-button');
        expect(brandButton).toBeInTheDocument();
        expect(screen.getByTestId('nav-brand')).toHaveTextContent('Test Brand');
    });

    it('renders navigation menu items', () => {
        //     export const DEFAULT_ROUTES = {
        //     HOME: '/',
        //     LOGIN: '/login',
        //     REGISTER: '/register',
        // } as const;
        renderNavBar();

        const menuButton = screen.getByTestId('nav-menu-button');
        fireEvent.click(menuButton);

        const menuItems = screen.getAllByRole('menuitem');
        expect(menuItems).toHaveLength(mockConfig.items.length + 2); // +2 for Logout and Login/Register items
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('calls toggleMode when theme toggle is clicked', () => {
        renderNavBar();

        const themeToggle = screen.getByTestId('nav-theme-toggle');
        fireEvent.click(themeToggle);

        expect(mockToggleMode).toHaveBeenCalled();
    });

    it('renders custom toolbar if provided', () => {
        renderNavBar();

        const customToolbar = screen.getByTestId('custom-toolbar');
        expect(customToolbar).toBeInTheDocument();
    });

    it('handles menu item clicks correctly', () => {
        renderNavBar();

        const menuButton = screen.getByTestId('nav-menu-button');

        fireEvent.click(menuButton);
        const homeItem = screen.getByText('Home');
        fireEvent.click(homeItem);
        expect(window.location.pathname).toBe('/');

        fireEvent.click(menuButton);
        const aboutItem = screen.getByText('About');
        fireEvent.click(aboutItem);
        expect(window.location.pathname).toBe('/about');
    });
});