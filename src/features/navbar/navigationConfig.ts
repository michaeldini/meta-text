/**
 * Navigation configuration for the navbar menu
 * - Defines icons, labels, paths, and visibility conditions for each menu item (includes brand item)
 * - Supports authenticated and unauthenticated states
 */

import { MenuIcon, LoginIcon, LogoutIcon, HomeIcon, PlusIcon, ChatBubbleLeftIcon, DocumentUploadIcon, DocumentDownloadIcon, MetaTextLogoIcon } from 'icons';
import { IconProps } from 'icons';


interface NavigationItem {
    label: string;
    protected: boolean;
    icon: React.ComponentType<IconProps>;
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
            icon: MetaTextLogoIcon, // replace with metatext logo icon
            action: () => navigate('/')
        },
        {
            label: 'Login',
            protected: false,
            icon: LoginIcon,
            action: () => navigate('/login')
        },
        {
            label: 'Logout',
            protected: true,
            icon: LogoutIcon,
            action: () => { logout(); navigate('/login'); }
        },
        {
            label: 'Register',
            protected: false,
            icon: PlusIcon,
            action: () => navigate('/register')
        },
        {
            label: 'Metatexts',
            protected: true,
            icon: DocumentUploadIcon,
            action: () => navigate('/metatext')
        },
        {
            label: 'SourceDocs',
            protected: true,
            icon: DocumentDownloadIcon,
            action: () => navigate('/sourcedoc')
        },
    ]
});
