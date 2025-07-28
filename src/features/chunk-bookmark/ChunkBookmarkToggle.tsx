// Toggle bookmark state for a chunk

import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { TooltipButton } from 'components'
import { useBookmarkUIStore } from './bookmarkStore';
import { useBookmark, useSetBookmark, useRemoveBookmark } from 'features/documents/useBookmark';
import { HiBookmark, HiOutlineBookmark } from 'react-icons/hi2';
import { ChunkType } from 'types';

interface ChunkBookmarkToggleProps {
    chunk: ChunkType;
}


export function ChunkBookmarkToggle({ chunk }: ChunkBookmarkToggleProps) {
    // Get the current bookmarked chunk from React Query
    const { data: bookmarkedChunkId } = useBookmark(chunk.metatext_id);
    const setBookmarkMutation = useSetBookmark(chunk.metatext_id);
    const removeBookmarkMutation = useRemoveBookmark(chunk.metatext_id);
    const isBookmarked = bookmarkedChunkId === chunk.id;
    const { clearNavigateToBookmark } = useBookmarkUIStore();

    const handleToggle = async () => {
        if (isBookmarked) {
            // If already bookmarked, remove the bookmark
            removeBookmarkMutation.mutate();
            // Clear any navigation to bookmark state
            clearNavigateToBookmark();
        } else {
            setBookmarkMutation.mutate(chunk.id);
        }
    };

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