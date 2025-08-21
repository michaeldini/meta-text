import { getIconComponent } from '@components/icons/registry';
/**
 * Navigation configuration for the navbar menu
 * - Defines icons, labels, paths, and visibility conditions for each menu item (includes brand item)
 * - Supports authenticated and unauthenticated states
 */

import { MetaTextLogoIcon } from '@components/icons';


type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ComponentType<{
    size?: number | string;
    color?: string;
}>;

interface NavigationItem {
    label: string;
    protected: boolean;
    icon: IconComponent;
    action: () => void;
    disabled?: boolean;
}

interface NavBarProps {
    items: NavigationItem[];
}

/**
 * Get the navigation configuration for the navbar.
 * @param logout - Function to call for logging out.
 * @param navigate - Function to call for navigation.
 * @returns The navigation configuration for the navbar.
 */
export const getNavigationConfig = (logout: () => void, navigate: (path: string) => void): NavBarProps => ({
    items: [
        {
            label: 'Home',
            protected: false,
            icon: MetaTextLogoIcon,
            action: () => navigate('/')
        },
        {
            label: 'Login',
            protected: false,
            icon: getIconComponent('Login'),
            action: () => navigate('/login')
        },
        {
            label: 'Logout',
            protected: true,
            icon: getIconComponent('Logout'),
            action: () => { logout(); navigate('/login'); }
        },
        {
            label: 'Register',
            protected: false,
            icon: getIconComponent('Add'),
            action: () => navigate('/register')
        },
    ]
});
