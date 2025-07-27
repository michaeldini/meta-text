// ChunkFavoriteFilterToggle.tsx
// Toggle button to filter chunks by favorite status in the metatext detail view.
// Uses Material UI IconButton and Heroicons for a modern, accessible UI.

import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { Tooltip } from 'components';
import { HiOutlineStar, HiStar } from 'react-icons/hi2';
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
                    color={showOnlyFavorites ? 'yellow' : 'primary'}
                    aria-label={showOnlyFavorites ? 'Show all chunks' : 'Show only favorite chunks'}
                    variant="ghost"
                >
                    {showOnlyFavorites ? (
                        <HiStar />
                    ) : (
                        <HiOutlineStar />
                    )}
                </IconButton>
            </span>
        </Tooltip>
    );
}

export default ChunkFavoriteFilterToggle;