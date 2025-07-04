import React from 'react';
import {
    AppBar,
    Toolbar,
    useTheme,
} from '@mui/material';

import { ThemeToggle } from 'components';
import { useThemeContext } from '../../contexts/ThemeContext';

import { createNavbarStyles } from './NavBar.styles';
import NavBarHeader from './components/NavBarHeader';

const NavBar: React.FC = () => {
    const theme = useTheme();
    const styles = createNavbarStyles(theme);
    const { toggleMode } = useThemeContext();

    return (
        <AppBar
            position="static"
            sx={styles.appBar}
            data-testid="navbar"
        >
            <Toolbar sx={styles.toolbar}>
                <NavBarHeader styles={styles} />
                <ThemeToggle onToggle={toggleMode} data-testid="nav-theme-toggle" />
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;

/**
 * NavBar component for application navigation.
 *
 * @param config - Navigation configuration object. Must include:
 *   - brand: { label: string; path: string }
 *   - items: Array<{ id: string; label: string; path?: string; action?: () => void; icon?: React.ReactNode; showWhen: 'authenticated' | 'unauthenticated' | 'always'; disabled?: boolean; badge?: string | number }>
 * @param data-testid - Optional test id for testing.
 */
