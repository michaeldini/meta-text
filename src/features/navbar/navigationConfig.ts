// Centralized navigation configuration for the app.
// All navigation items, including brand, are defined here.
// Use this as the single source of truth for navigation structure.


import { NavBarProps } from './types';

import { MenuIcon, LoginIcon, LogoutIcon, HomeIcon, PlusIcon, ChatBubbleLeftIcon, DocumentUploadIcon, DocumentDownloadIcon } from 'icons';


export const getNavigationConfig = (logout: () => void): NavBarProps => ({
    config: {
        brand: {
            id: 'brand',
            label: 'Meta-Text',
            path: '/',
            showWhen: 'always' as const,
        },
        items: [

            {
                id: 'about',
                label: 'About',
                path: '/about',
                showWhen: 'always' as const,
                icon: ChatBubbleLeftIcon,
            },
            {
                id: 'metatext',
                label: 'Metatexts',
                path: '/metatext',
                showWhen: 'authenticated' as const,
                icon: DocumentUploadIcon,
            },
            {
                id: 'sourcedoc',
                label: 'SourceDocs',
                path: '/sourcedoc',
                showWhen: 'authenticated' as const,
                icon: DocumentDownloadIcon,
            },
            {
                id: 'home',
                label: 'Home',
                path: '/',
                showWhen: 'authenticated' as const,
                icon: HomeIcon,

            },
            {
                id: 'login',
                label: 'Login',
                path: '/login',
                showWhen: 'unauthenticated' as const,
                icon: LoginIcon,
            },
            {
                id: 'register',
                label: 'Register',
                path: '/register',
                showWhen: 'unauthenticated' as const,
                icon: PlusIcon,
            },
            {
                id: 'logout',
                label: 'Logout',
                path: '',
                icon: LogoutIcon,
                action: logout,
                showWhen: 'authenticated' as const,
            },
        ]
    }
}); 
