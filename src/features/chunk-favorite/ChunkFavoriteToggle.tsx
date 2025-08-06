// ChunkFavoriteToggle.tsx
// Toggle button for favoriting/unfavoriting a chunk. Uses Material UI IconButton and Heroicons.
// Handles API calls to backend and updates UI state optimistically.

import React, { useState } from 'react';
import { IconButton, Spinner, Box } from '@chakra-ui/react';
import { TooltipButton } from '@components/TooltipButton';
import { HiStar, HiOutlineStar } from 'react-icons/hi2';
import { api } from '@utils/ky';
import type { ChunkType } from '@mtypes/documents';
import { useChunksQuery } from '@hooks/useChunksQuery';

interface ChunkFavoriteToggleProps {
    chunk: ChunkType;
}


export function ChunkFavoriteToggle({ chunk }: ChunkFavoriteToggleProps) {
    const [loading, setLoading] = useState(false);
    // Use React Query for chunk data and refetch
    const metatextId = chunk.metatext_id;
    const { refetch } = useChunksQuery(metatextId);
    const favorited = !!chunk.favorited_by_user_id;

    const handleToggle = async () => {
        setLoading(true);
        try {
            if (favorited) {
                await api.delete(`chunk/${chunk.id}/favorite`);
            } else {
                await api.post(`chunk/${chunk.id}/favorite`);
            }
            // Refetch chunks to update UI
            await refetch();
        } catch (e) {
            // Optionally show error
        } finally {
            setLoading(false);
        }
    };

    return (
        <TooltipButton
            label=""
            tooltip={favorited ? 'Unfavorite' : 'Favorite'}
            icon={favorited ? <HiStar /> : <HiOutlineStar />}
            loading={loading}
            onClick={handleToggle}
            disabled={loading}
            size="lg"
            iconSize="lg"
        />
    );
}

export default ChunkFavoriteToggle;