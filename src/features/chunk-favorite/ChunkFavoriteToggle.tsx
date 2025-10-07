import React from 'react';
import type { ChunkType } from '@mtypes/documents';
import useChunkFavoriteToggle from './useChunkFavoriteToggle';
import { Button, Tooltip } from '@components';
import { HiOutlineStar, HiStar } from 'react-icons/hi2';

interface ChunkFavoriteToggleProps {
    chunk: ChunkType;
}

function ChunkFavoriteToggle({ chunk }: ChunkFavoriteToggleProps) {
    const { loading, favorited, toggle } = useChunkFavoriteToggle(chunk);
    return (
        <Tooltip content={favorited ? 'Unfavorite' : 'Favorite'}>
            <Button
                icon={favorited ? <HiStar /> : <HiOutlineStar />}
                onClick={toggle}
                tone={favorited ? 'primary' : 'default'}
                disabled={loading}
            />
        </Tooltip>
    );
}

export default ChunkFavoriteToggle;