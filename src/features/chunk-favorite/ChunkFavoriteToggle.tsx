// ChunkFavoriteToggle.tsx
// Toggle button for favoriting/unfavoriting a chunk. Uses Material UI IconButton and Heroicons.
// Handles API calls to backend and updates UI state optimistically.

import React, { useState } from 'react';
import { IconButton, Tooltip, CircularProgress, Box } from '@mui/material';
import { StarIcon, StarOutlineIcon } from 'icons';
import { useTheme } from '@mui/material/styles';
import { api } from 'utils';
import type { ChunkType } from 'types';
import { useChunkStore } from 'store';

interface ChunkFavoriteToggleProps {
    chunk: ChunkType;
}


export function ChunkFavoriteToggle({ chunk }: ChunkFavoriteToggleProps) {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);

    // Get chunk store for updating global state
    const { chunks, setChunks } = useChunkStore();
    const favorited = !!chunk.favorited_by_user_id;

    const handleToggle = async () => {
        setLoading(true);
        try {
            let updatedChunk: ChunkType;
            if (favorited) {
                await api.delete(`chunk/${chunk.id}/favorite`);
                updatedChunk = { ...chunk, favorited_by_user_id: null };
            } else {
                await api.post(`chunk/${chunk.id}/favorite`);
                // You may want to use the actual user id here if available
                updatedChunk = { ...chunk, favorited_by_user_id: 1 };
            }
            // Update the chunk in the global store
            const newChunks = chunks.map(c => c.id === chunk.id ? updatedChunk : c);
            setChunks(newChunks);
        } catch (e) {
            // Optionally show error
        } finally {
            setLoading(false);
        }
    };

    return (
        <Tooltip title={favorited ? 'Unfavorite' : 'Favorite'}>
            <span>
                <IconButton
                    onClick={handleToggle}
                    color={favorited ? 'warning' : 'default'}
                    disabled={loading}
                    size="small"
                    aria-label={favorited ? 'Unfavorite chunk' : 'Favorite chunk'}
                >
                    {loading ? (
                        <CircularProgress />
                    ) : favorited ? (
                        <StarIcon />
                    ) : (
                        <StarOutlineIcon />
                    )}
                </IconButton>
            </span>
        </Tooltip>
    )
}

export default ChunkFavoriteToggle;