// Navigation bar that sites at the top of the application, providing navigation links and theme toggle functionality.

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
                <ThemeToggle onToggle={toggleMode} />
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;