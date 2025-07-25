// Toggle bookmark state for a chunk

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useBookmarkUIStore } from './bookmarkStore';
import { useBookmark, useSetBookmark, useRemoveBookmark } from 'features/documents/useBookmark';
import { BookmarkIcon, BookmarkOutlineIcon } from 'icons';
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
        <Tooltip title="Toggle bookmark" arrow>
            <span style={{ display: 'inline-flex' }}>
                <IconButton onClick={handleToggle} data-testid={`bookmark-toggle-${chunk.id}`}>
                    {isBookmarked ? <BookmarkIcon /> : <BookmarkOutlineIcon />}
                </IconButton>
            </span>
        </Tooltip>
    );
}

export default ChunkBookmarkToggle;