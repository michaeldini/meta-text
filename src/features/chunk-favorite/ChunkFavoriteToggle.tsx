// TODO: move api calls to service file
import React, { useState } from 'react';
import { Icon } from '@components/icons/Icon';
import { TooltipButton } from '@components/TooltipButton';
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
        } catch {
            // Optionally show error
        } finally {
            setLoading(false);
        }
    };

    return (
        <TooltipButton
            label=""
            tooltip={favorited ? 'Unfavorite' : 'Favorite'}
            icon={favorited ? <Icon name='FavoriteFilled' /> : <Icon name='Favorite' />}
            loading={loading}
            onClick={handleToggle}
            disabled={loading}
            size="lg"
            iconSize="lg"
        />
    );
}

export default ChunkFavoriteToggle;