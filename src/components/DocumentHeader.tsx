import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';

interface DocumentHeaderProps {
    title?: string;
    children: React.ReactNode;
    sx?: object;
    elevation?: number;
}


const DocumentHeader: React.FC<DocumentHeaderProps> = ({ title, children, sx = {}, elevation = 10 }) => {
    const theme = useTheme();
    const styles = {
        padding: theme.spacing(2),
        gap: theme.spacing(2),
        marginBottom: theme.spacing(10),
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        // width: '100%',
        boxSizing: 'border-box',
        flex: 1,

    };
    return (
        <Box sx={styles}>
            <Typography variant="h3" color={theme.palette.text.secondary}>
                {title}
            </Typography>
            {children}
        </Box>
    );
};

export default DocumentHeader;
