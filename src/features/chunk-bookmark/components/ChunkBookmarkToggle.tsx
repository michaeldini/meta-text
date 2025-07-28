// Click this toggle to bookmark or unbookmark a chunk.

import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { TooltipButton } from 'components'
import { useChunkBookmarkToggle } from '../hooks/useChunkBookmarkToggle';
import { HiBookmark, HiOutlineBookmark } from 'react-icons/hi2';
import { ChunkType } from 'types';

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