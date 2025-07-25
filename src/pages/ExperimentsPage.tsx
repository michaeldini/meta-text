import React, { useState } from 'react';
import { Box, Paper, Fab } from '@mui/material';
import { keyframes } from '@emotion/react';
import {
    StarsIcon as AddIcon,
    MenuIcon as EditIcon,
    UndoArrowIcon as NavigationIcon,
    QuestionMarkIcon as FavoriteIcon,
} from '../components/icons';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(24px);}
  to { opacity: 1; transform: translateY(0);}
`;

export function AnimatedShape({ isCircle }: { isCircle: boolean }) {
    return (
        <Box
            sx={{
                position: 'relative',
                height: 80,
                mb: 3,
                cursor: 'pointer',
                userSelect: 'none',
            }}
        >

            <Box
                sx={{
                    position: 'absolute',
                    left: isCircle ? 'calc(100% - 64px)' : 0,
                    transition: 'left 0.6s cubic-bezier(0.4,0,0.2,1)',
                    width: 64,
                    height: 64,
                    background: isCircle ? '#43a047' : '#1976d2',
                    borderRadius: isCircle ? '50%' : '16px',
                    boxShadow: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 24,
                    cursor: 'pointer',
                    transitionProperty: 'left, background, border-radius',
                    transitionDuration: '0.6s',
                    transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
                }}
            >
                {isCircle ? '●' : '■'}
            </Box>
        </Box>
    );
}

export function LayoutFrames() {
    const [frame, setFrame] = useState(0);
    const [isCircle, setIsCircle] = useState(false);

    return (
        <Paper>
            <Box sx={{
                position: 'fixed',
                // bottom: 32,
                right: 32,
                zIndex: 1300,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                '& > :not(style)': { m: 1 },
            }}>
                <Fab color="primary" aria-label="add">
                    <AddIcon />
                </Fab>
                <Fab color="secondary" aria-label="edit">
                    <EditIcon />
                </Fab>
                <Fab variant="extended">
                    <NavigationIcon sx={{ mr: 1 }} />
                    Navigate
                </Fab>
                <Fab disabled aria-label="like">
                    <FavoriteIcon />
                </Fab>
            </Box>
        </Paper>
    );
};

export function ExperimentsPage() {
    return <LayoutFrames />;
}

export default ExperimentsPage;
