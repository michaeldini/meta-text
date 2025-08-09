// ChunkFavoriteToggle.tsx
// Toggle button for favoriting/unfavoriting a chunk. Uses Material UI IconButton and Heroicons.
// Handles API calls to backend and updates UI state optimistically.

// TODO: move api calls to service file
// refactor the handletoggle func


import React, { useState } from 'react';
import { TooltipButton } from '@components/TooltipButton';
import { HiStar, HiOutlineStar } from 'react-icons/hi2';
import { api } from '@utils/ky';
import type { ChunkType } from '@mtypes/documents';
import { useQueryClient } from '@tanstack/react-query';

interface ChunkFavoriteToggleProps {
    chunk: ChunkType;
}


export function ChunkFavoriteToggle({ chunk }: ChunkFavoriteToggleProps) {
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const metatextId = chunk.metatext_id;
    const favorited = !!chunk.favorited_by_user_id;

    const handleToggle = async () => {
        setLoading(true);
        try {
            if (favorited) {
                await api.delete(`chunk/${chunk.id}/favorite`);
            } else {
                await api.post(`chunk/${chunk.id}/favorite`);
            }
            // Invalidate both caches to ensure UI updates immediately
            queryClient.invalidateQueries({ queryKey: ['metatextDetail', metatextId] });
            queryClient.invalidateQueries({ queryKey: ['chunks', metatextId] });
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