/**
 * Navigation bar that sits at the top of the application, providing navigation links and theme toggle functionality.
 * It includes a header component (menu and logo) and a theme toggle button.
 * Uses Material UI AppBar and Toolbar for layout.
 */

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
            <Toolbar >
                <NavBarHeader styles={styles} />
                <ThemeToggle onToggle={toggleMode} />
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;