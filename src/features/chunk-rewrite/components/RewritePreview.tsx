import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import type { RewritePreviewProps } from 'features/chunk-shared/types';


export function RewritePreview({ preview }: RewritePreviewProps) {
    if (!preview) return null;
    return (
        <Box mt={3}>
            <Text fontSize="lg" fontWeight="bold">Preview:</Text>
            <Box p={2} borderRadius={1} mt={1}>
                <Text>{preview}</Text>
            </Box>
        </Box>
    );
}

export default RewritePreview;