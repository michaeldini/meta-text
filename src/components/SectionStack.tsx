/**
 * SectionStack
 * ---------------------------------------------------------------------------
 * Shared wrapper component for homepage section content (Metatexts & Source
 * Documents). Encapsulates the previously shared `commonStackProps` so callers
 * no longer have to import and pass a constants object. Accepts arbitrary
 * children and forwards any additional Stack props for extensibility.
 */
import React from 'react';
import { Stack } from '@chakra-ui/react/stack';
import type { StackProps } from '@chakra-ui/react';
import { StackSeparator } from '@chakra-ui/react/stack';

export interface SectionStackProps extends StackProps {
    children: React.ReactNode;

}

function SectionStack({ children, ...rest }: SectionStackProps) {
    return (
        <Stack
            direction={{ base: 'column', lg: 'row' }}
            separator={<StackSeparator />}
            gap={{ base: 0, lg: 10 }}
            {...rest}
        >
            {children}
        </Stack>
    );
}

export default SectionStack;
