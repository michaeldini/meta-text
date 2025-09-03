import React from 'react';
import { HiOutlineStar, HiStar } from 'react-icons/hi2';
import { TooltipButton } from '@components/TooltipButton';
import type { ChunkType } from '@mtypes/documents';
import useChunkFavoriteToggle from './useChunkFavoriteToggle';

interface ChunkFavoriteToggleProps {
    chunk: ChunkType;
}


export function ChunkFavoriteToggle({ chunk }: ChunkFavoriteToggleProps) {
    const { loading, favorited, toggle: handleToggle } = useChunkFavoriteToggle(chunk);

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