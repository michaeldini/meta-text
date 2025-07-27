import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { RewriteTool } from '../RewriteTool';
import type { RewriteEmptyStateProps } from 'features/chunk-shared/types';


export function RewriteEmptyState({ chunk, onRewriteCreated }: RewriteEmptyStateProps) {
    return (
        <Box>
            <Text>No rewrites available. Use the Rewrite Tool below to create a new rewrite for this chunk.</Text>
            <Box>
                <RewriteTool chunk={chunk} onRewriteCreated={onRewriteCreated} />
            </Box>
        </Box>
    );
}

export default RewriteEmptyState;