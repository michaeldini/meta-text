// ChunkFavoriteFilterToggle.tsx
// Toggle button to filter chunks by favorite status in the metatext detail view.
// Uses Material UI IconButton and Heroicons for a modern, accessible UI.

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { StarIcon as StarFilled } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { useTheme } from '@mui/material/styles';

interface ChunkFavoriteFilterToggleProps {
    showOnlyFavorites: boolean;
    onToggle: (showOnlyFavorites: boolean) => void;
}


export function ChunkFavoriteFilterToggle({ showOnlyFavorites, onToggle }: ChunkFavoriteFilterToggleProps) {
    const theme = useTheme();
    return (
        <Tooltip title={showOnlyFavorites ? 'Show all chunks' : 'Show only favorites'}>
            <span>
                <IconButton
                    onClick={() => onToggle(!showOnlyFavorites)}
                    color={showOnlyFavorites ? 'warning' : 'default'}
                    size="small"
                    aria-label={showOnlyFavorites ? 'Show all chunks' : 'Show only favorite chunks'}
                >
                    {showOnlyFavorites ? (
                        <StarFilled style={{ color: theme.palette.warning.main, width: 22, height: 22 }} />
                    ) : (
                        <StarOutline style={{ color: theme.palette.action.disabled, width: 22, height: 22 }} />
                    )}
                </IconButton>
            </span>
        </Tooltip>
    );
}

export default ChunkFavoriteFilterToggle;