import React from 'react';
import { HiOutlineStar, HiStar } from 'react-icons/hi2';
import { Box } from '@styles';
import type { ChunkType } from '@mtypes/documents';
import useChunkFavoriteToggle from './useChunkFavoriteToggle';
import TooltipButton from '@components/TooltipButton';

interface ChunkFavoriteToggleProps {
    chunk: ChunkType;
}

function ChunkFavoriteToggle({ chunk }: ChunkFavoriteToggleProps) {
    const { loading, favorited, toggle: handleToggle } = useChunkFavoriteToggle(chunk);
    return (
        <TooltipButton
            label=""
            tooltip={favorited ? 'Unfavorite' : 'Favorite'}
            icon={favorited ? <HiStar /> : <HiOutlineStar />}
            onClick={handleToggle}
            tone={favorited ? 'primary' : 'default'}
            disabled={loading}
        />
    );
}

export default ChunkFavoriteToggle;