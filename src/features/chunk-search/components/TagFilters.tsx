// Tag filter component for refining search results
// Displays toggleable chips for common tags as described in the feature guide

import React, { useCallback } from 'react';
import { Box } from '@chakra-ui/react/box';
import { Tag } from '@chakra-ui/react/tag';
import { Text } from '@chakra-ui/react';
import { Stack } from '@chakra-ui/react/stack';
import { useSearchStore } from '../store/useSearchStore';

interface TagFiltersProps {
    availableTags?: string[];
}

// Common tags that users might want to filter by
const DEFAULT_TAGS = ['#chapter', '#comment', '#todo', '#note', '#quote', '#important'];

export function TagFilters(props: TagFiltersProps) {
    const { availableTags = DEFAULT_TAGS } = props;

    const { activeTags, toggleTag } = useSearchStore();

    const handleTagToggle = useCallback((tag: string) => {
        toggleTag(tag);
    }, [toggleTag]);

    if (!availableTags.length) {
        return null;
    }

    return (
        <Box >
            <Text
                fontSize="sm"
                color="gray.500"
            >
                Filter by tags (not implemented in search)
            </Text>

            <Stack
                direction="row"
            >
                {availableTags.map((tag) => {
                    const isActive = activeTags.includes(tag);

                    return (
                        <Tag.Root key={tag} variant="solid" >
                            <button onClick={() => handleTagToggle(tag)} key={tag}>
                                <Tag.Label>{tag}</Tag.Label>
                            </button>
                        </Tag.Root>
                    );
                })}
            </Stack>
        </Box>
    );
};

