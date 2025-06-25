// Chunks feature-specific styles using Material UI's sx prop style objects
import { Button } from '@mui/material';
import React from 'react';

export const chunkMainBox = {
    minWidth: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: 2,
    p: 2,
    border: '1px solid transparent',
    borderRadius: 2,
    '&:hover': {
        borderColor: 'secondary.main',
        borderStyle: 'solid',
    }
};


