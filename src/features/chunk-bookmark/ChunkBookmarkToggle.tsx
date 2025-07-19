// Toggle bookmark state for a chunk

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useBookmarkStore } from 'store';
import { BookmarkIcon, BookmarkOutlineIcon } from 'icons';
import { ChunkType } from 'types';

interface ChunkBookmarkToggleProps {
    chunk: ChunkType;
}

const ChunkBookmarkToggle: React.FC<ChunkBookmarkToggleProps> = ({ chunk }) => {
    const { bookmarkedChunkId, setBookmarkedChunkId, hydrateBookmark } = useBookmarkStore();
    const isBookmarked = bookmarkedChunkId === chunk.id;
    const handleToggle = async () => {
        if (isBookmarked) {
            // Clear the bookmark by hydrating with null
            hydrateBookmark(null);
            // Optionally, you may want to clear it on the backend as well if API supports
        } else {
            console.log('Bookmarking chunk:', chunk);
            await setBookmarkedChunkId(chunk.metatext_id, chunk.id);
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
