// Toggle bookmark state for a chunk

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useUIPreferencesStore } from 'store/uiPreferences';
import { BookmarkIcon, BookmarkOutlineIcon } from 'icons';
import { ChunkType } from 'types';

interface ChunkBookmarkToggleProps {
    chunk: ChunkType;
}

const ChunkBookmarkToggle: React.FC<ChunkBookmarkToggleProps> = ({ chunk }) => {
    const { bookmarkedChunkId, setBookmarkedChunkId, clearBookmark } = useUIPreferencesStore();
    const isBookmarked = bookmarkedChunkId === chunk.id;
    const handleToggle = () => {
        if (isBookmarked) {
            clearBookmark(chunk.meta_text_id);
        } else {
            console.log('Bookmarking chunk:', chunk);
            setBookmarkedChunkId(chunk.meta_text_id, chunk.id);
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
