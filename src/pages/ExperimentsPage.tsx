import React, { useState } from 'react';
import { Box, Typography, Paper, Button, Stack } from '@mui/material';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(24px);}
  to { opacity: 1; transform: translateY(0);}
`;

const AnimatedShape: React.FC<{ isCircle: boolean }> = ({ isCircle }) => (
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

const LayoutFrames: React.FC = () => {
    const [frame, setFrame] = useState(0);
    const [isCircle, setIsCircle] = useState(false);

    return (
        <Paper
            elevation={3}
            sx={{
                animation: `${fadeIn} 1s ease`,
                p: 4,
                maxWidth: 600,
                mx: 'auto',
                mt: 8,
                textAlign: 'center',
            }}
        >
            <Button
                variant="contained"
                color="secondary"
                sx={{ mb: 3 }}
                onClick={() => setFrame((f) => (f === 0 ? 1 : 0))}
            >
                Switch Layout
            </Button>
            <Box
                sx={{
                    position: 'relative',
                    minHeight: 260,
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        top: 0,
                        left: 0,
                        opacity: frame === 0 ? 1 : 0,
                        pointerEvents: frame === 0 ? 'auto' : 'none',
                        transition: 'opacity 0.5s cubic-bezier(0.4,0,0.2,1)',
                    }}
                >
                    <Stack spacing={3} alignItems="center">
                        <Typography variant="h4" color="primary" fontWeight={700}>
                            Frame One
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            This is the first layout frame. Components are arranged vertically.
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => setIsCircle((prev) => !prev)}
                        >
                            Toggle Shape
                        </Button>
                        <AnimatedShape isCircle={isCircle} />
                    </Stack>
                </Box>
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        top: 0,
                        left: 0,
                        opacity: frame === 1 ? 1 : 0,
                        pointerEvents: frame === 1 ? 'auto' : 'none',
                        transition: 'opacity 0.5s cubic-bezier(0.4,0,0.2,1)',
                    }}
                >
                    <Typography variant="h4" color="success.main" fontWeight={700}>
                        Frame Two
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, mb: 3 }}>
                        <AnimatedShape isCircle={!isCircle} />
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                This is the second layout frame. Components are arranged horizontally.
                            </Typography>
                            <Button
                                variant="contained"
                                color="success"
                                sx={{ mt: 2 }}
                                onClick={() => setIsCircle((prev) => !prev)}
                            >
                                Toggle Shape
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

const ExperimentsPage: React.FC = () => <LayoutFrames />;

export default ExperimentsPage;
