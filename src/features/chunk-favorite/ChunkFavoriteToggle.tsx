import React from 'react';
import type { ChunkType } from '@mtypes/documents';
import useChunkFavoriteToggle from './useChunkFavoriteToggle';
import TooltipButton from '@components/ui/TooltipButton';
import { HiOutlineStar, HiStar } from 'react-icons/hi2';

interface ChunkFavoriteToggleProps {
    chunk: ChunkType;
}

function ChunkFavoriteToggle({ chunk }: ChunkFavoriteToggleProps) {
    const { loading, favorited, toggle } = useChunkFavoriteToggle(chunk);
    return (
        <TooltipButton
            label=""
            tooltip={favorited ? 'Unfavorite' : 'Favorite'}
            icon={favorited ? <HiStar /> : <HiOutlineStar />}
            onClick={toggle}
            tone={favorited ? 'primary' : 'default'}
            disabled={loading}
        />
    );
}

export default ChunkFavoriteToggle;