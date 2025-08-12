/**
 * SectionStack
 * ---------------------------------------------------------------------------
 * Shared wrapper component for homepage section content (Metatexts & Source
 * Documents). Encapsulates the previously shared `commonStackProps` so callers
 * no longer have to import and pass a constants object. Accepts arbitrary
 * children and forwards any additional Stack props for extensibility.
 */
import React from 'react';
import { Grid } from '@chakra-ui/react';

export interface ResponsiveGridProps {
    children: React.ReactNode;

}

function ResponsiveGridSection({ children, ...rest }: ResponsiveGridProps) {
    return (
        <Grid
            templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(3, 1fr)" }}
            // direction={{ base: 'column', lg: 'row' }}
            gap={{ base: 2, lg: 10 }}
            {...rest}
        >
            {children}
        </Grid>
    );
}

export default ResponsiveGridSection;
