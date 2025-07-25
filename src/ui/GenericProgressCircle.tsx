// Generic circular progress indicator for loading/progress states
// Uses Chakra UI ProgressCircle for consistent UI

import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { ProgressCircle } from '@chakra-ui/react';

/**
 * GenericProgressCircle
 * Displays a circular progress indicator with optional label text.
 * Props:
 *   - label: string (optional) - text to display below the spinner
 *   - size: 'sm' | 'md' | 'lg' (default: 'sm')
 */
export interface GenericProgressCircleProps {
    label?: string;
    size?: 'sm' | 'md' | 'lg';
}

const GenericProgressCircle: React.FC<GenericProgressCircleProps> = ({ label = 'Loading...', size = 'sm' }) => (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <ProgressCircle.Root value={null} size={size}>
            <ProgressCircle.Circle>
                <ProgressCircle.Track />
                <ProgressCircle.Range />
            </ProgressCircle.Circle>
        </ProgressCircle.Root>
        {label && <Text mt={2}>{label}</Text>}
    </Box>
);

export default GenericProgressCircle;
