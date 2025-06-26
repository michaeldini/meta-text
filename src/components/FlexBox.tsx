import React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

/**
 * A wrapper for flex layouts with sensible defaults matching app style patterns.
 * - display: flex
 * - flexDirection: column (default)
 * - alignItems: stretch (default)
 * - gap: theme.spacing(2) (default)
 *
 * All props can be overridden per usage.
 */
const FlexBox: React.FC<BoxProps & {
    flexDirection?: BoxProps['flexDirection'];
    alignItems?: BoxProps['alignItems'];
    gap?: number | string;
}> = ({
    children,
    sx,
    flexDirection = 'column',
    alignItems = 'center',
    gap = 2,
    ...props
}) => {
        const theme = useTheme();
        return (
            <Box
                display="flex"
                flexDirection={flexDirection}
                alignItems={alignItems}
                padding='0 32px'
                gap={typeof gap === 'number' ? theme.spacing(gap) : gap}
                sx={sx}
                {...props}
            >
                {children}
            </Box>
        );
    };

export default FlexBox;
