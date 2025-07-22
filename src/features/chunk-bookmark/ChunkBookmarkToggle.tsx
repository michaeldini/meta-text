// Toggle bookmark state for a chunk

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useBookmarkUIStore } from 'store/bookmarkStore';
import { useBookmark, useSetBookmark } from 'features/documents/useBookmark';
import { BookmarkIcon, BookmarkOutlineIcon } from 'icons';
import { ChunkType } from 'types';

interface ChunkBookmarkToggleProps {
    chunk: ChunkType;
}

const ChunkBookmarkToggle: React.FC<ChunkBookmarkToggleProps> = ({ chunk }) => {
    // Get the current bookmarked chunk from React Query
    const { data: bookmarkedChunkId } = useBookmark(chunk.metatext_id);
    const setBookmarkMutation = useSetBookmark(chunk.metatext_id);
    const isBookmarked = bookmarkedChunkId === chunk.id;
    const { setNavigateToBookmark } = useBookmarkUIStore();

    const handleToggle = async () => {
        if (isBookmarked) {
            // Clear the bookmark by setting null (if API supports)
            // Optionally, implement a clearBookmark mutation if needed
            // For now, do nothing or show a message
        } else {
            setBookmarkMutation.mutate(chunk.id);
            setNavigateToBookmark();
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
};

export default ChunkBookmarkToggle;
