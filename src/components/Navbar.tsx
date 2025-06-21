import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Navbar: React.FC = () => {
    const theme = useTheme();

    return (
        <AppBar position="static" >
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Meta Text
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        color="inherit"
                    >
                        Documents
                    </Button>
                    <Button
                        color="inherit"
                    >
                        Settings
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
