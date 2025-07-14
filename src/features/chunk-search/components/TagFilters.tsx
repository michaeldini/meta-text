// Tag filter component for refining search results
// Displays toggleable chips for common tags as described in the feature guide

import React, { useCallback } from 'react';
import {
    Box,
    Chip,
    Typography,
    useTheme,
    Stack
} from '@mui/material';
import { useSearchStore } from '../store/useSearchStore';

interface TagFiltersProps {
    availableTags?: string[];
}

// Common tags that users might want to filter by
const DEFAULT_TAGS = ['#chapter', '#comment', '#todo', '#note', '#quote', '#important'];

export const TagFilters: React.FC<TagFiltersProps> = ({
    availableTags = DEFAULT_TAGS
}) => {
    const theme = useTheme();
    const { activeTags, toggleTag } = useSearchStore();

    const handleTagToggle = useCallback((tag: string) => {
        toggleTag(tag);
    }, [toggleTag]);

    if (!availableTags.length) {
        return null;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
            >
                Filter by tags (not implemented in search)
            </Typography>

            <Stack
                direction="row"
                spacing={1}
                sx={{
                    flexWrap: 'wrap',
                    gap: 1 // Add gap for wrapped items
                }}
            >
                {availableTags.map((tag) => {
                    const isActive = activeTags.includes(tag);

                    return (
                        <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            clickable
                            onClick={() => handleTagToggle(tag)}
                            color={isActive ? 'primary' : 'default'}
                            variant={isActive ? 'filled' : 'outlined'}
                            sx={{
                                fontSize: '0.75rem',
                                height: 24,
                                '& .MuiChip-label': {
                                    px: 1
                                },
                                '&:hover': {
                                    backgroundColor: isActive
                                        ? theme.palette.primary.dark
                                        : theme.palette.action.hover
                                },
                                transition: theme.transitions.create([
                                    'background-color',
                                    'border-color'
                                ], {
                                    duration: theme.transitions.duration.short
                                })
                            }}
                        />
                    );
                })}
            </Stack>
        </Box>
    );
};
