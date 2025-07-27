import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import type { RewriteDisplayProps } from 'features/chunk-shared/types';



export function RewriteDisplay({ selected }: RewriteDisplayProps) {
    if (!selected) return null;
    return (
        <Box>
            <Text>{selected.rewrite_text}</Text>
        </Box>
    );
}
export default RewriteDisplay;