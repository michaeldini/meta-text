/**
 * SectionStack
 * ---------------------------------------------------------------------------
 * Shared wrapper component for homepage section content (Metatexts & Source
 * Documents). Encapsulates the previously shared `commonStackProps` so callers
 * no longer have to import and pass a constants object. Accepts arbitrary
 * children and forwards any additional Stack props for extensibility.
 */
import React from 'react';
import { Box } from '@styles';

export interface ResponsiveGridProps {
    children: React.ReactNode;

}

function ResponsiveGridSection({ children, ...rest }: ResponsiveGridProps) {
    return (
        <Box
            css={{
                display: 'grid',
                gridTemplateColumns: 'repeat(1, 1fr)',
                gap: 8,
                '@media (min-width: 1024px)': {
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 40,
                },
            }}
            {...rest}
        >
            {children}
        </Box>
    );
}

export default ResponsiveGridSection;
