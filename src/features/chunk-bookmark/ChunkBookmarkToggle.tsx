// Toggle bookmark state for a chunk

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useUIPreferencesStore } from 'store/uiPreferences';
import { BookmarkIcon, BookmarkOutlineIcon } from 'icons';

interface ChunkBookmarkToggleProps {
    chunkId: number;
}

const ChunkBookmarkToggle: React.FC<ChunkBookmarkToggleProps> = ({ chunkId }) => {
    const { bookmarkedChunkId, setBookmarkedChunkId, clearBookmark } = useUIPreferencesStore();
    const isBookmarked = bookmarkedChunkId === chunkId;
    const handleToggle = () => {
        if (isBookmarked) {
            clearBookmark();
        } else {
            setBookmarkedChunkId(chunkId);
        }
    };

    return (
        <Tooltip title="Toggle bookmark" arrow>
            <span style={{ display: 'inline-flex' }}>
                <IconButton onClick={handleToggle} data-testid={`bookmark-toggle-${chunkId}`}>
                    {isBookmarked ? <BookmarkIcon /> : <BookmarkOutlineIcon />}
                </IconButton>
            </span>
        </Tooltip>
    );
};

export default ChunkBookmarkToggle;
