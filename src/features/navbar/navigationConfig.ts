/**
 * Navigation configuration for the navbar menu
 * - Defines icons, labels, paths, and visibility conditions for each menu item (includes brand item)
 * - Supports authenticated and unauthenticated states
 */

import { MetaTextLogoIcon } from '@components/icons';
import { HiArrowRightOnRectangle, HiArrowLeftOnRectangle, HiPlus } from "react-icons/hi2";


interface NavigationItem {
    label: string;
    protected: boolean;
    icon: React.ComponentType<any>;
    action: () => void;
    disabled?: boolean;
}

interface NavBarProps {
    items: NavigationItem[];
}


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
            icon: HiArrowRightOnRectangle,
            action: () => navigate('/login')
        },
        {
            label: 'Logout',
            protected: true,
            icon: HiArrowLeftOnRectangle,
            action: () => { logout(); navigate('/login'); }
        },
        {
            label: 'Register',
            protected: false,
            icon: HiPlus,
            action: () => navigate('/register')
        },
    ]
});
