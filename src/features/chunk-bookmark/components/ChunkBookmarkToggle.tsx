// Click this toggle to bookmark or un-bookmark a chunk.

import React from 'react';
import { TooltipButton } from '@components/TooltipButton'
import { useChunkBookmarkToggle } from '../hooks/useChunkBookmarkToggle';
import { HiBookmark, HiOutlineBookmark } from 'react-icons/hi2';
import { ChunkType } from '@mtypes/documents';

interface ChunkBookmarkToggleProps {
    chunk: ChunkType;
}

export function ChunkBookmarkToggle({ chunk }: ChunkBookmarkToggleProps) {
    const { isBookmarked, handleToggle } = useChunkBookmarkToggle(chunk);
    return (

        <TooltipButton
            label=""
            tooltip={isBookmarked ? "Remove Bookmark" : "Bookmark this chunk"}
            onClick={handleToggle}
            data-testid={`bookmark-toggle-${chunk.id}`}
            icon={isBookmarked ? <HiBookmark /> : <HiOutlineBookmark />}
        />
    );
}

export default ChunkBookmarkToggle;