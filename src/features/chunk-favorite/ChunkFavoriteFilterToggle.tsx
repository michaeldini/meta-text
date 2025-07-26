// ChunkFavoriteFilterToggle.tsx
// Toggle button to filter chunks by favorite status in the metatext detail view.
// Uses Material UI IconButton and Heroicons for a modern, accessible UI.

import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { Tooltip } from 'components';
import { StarIcon as StarFilled } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { useTheme } from '@mui/material/styles';

interface ChunkFavoriteFilterToggleProps {
    showOnlyFavorites: boolean;
    onToggle: (showOnlyFavorites: boolean) => void;
}


export function ChunkFavoriteFilterToggle({ showOnlyFavorites, onToggle }: ChunkFavoriteFilterToggleProps) {
    return (
        <Tooltip content={showOnlyFavorites ? 'Show all chunks' : 'Show only favorites'}>
            <span>
                <IconButton
                    onClick={() => onToggle(!showOnlyFavorites)}
                    color={showOnlyFavorites ? 'warning' : 'default'}
                    aria-label={showOnlyFavorites ? 'Show all chunks' : 'Show only favorite chunks'}
                >
                    {showOnlyFavorites ? (
                        <StarFilled />
                    ) : (
                        <StarOutline />
                    )}
                </IconButton>
            </span>
        </Tooltip>
    );
}

export default ChunkFavoriteFilterToggle;