// Button to navigate to bookmarked chunk
// Extracted from MetatextDetailPage for cleaner code

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useUIPreferencesStore } from 'store';
import { BookmarkIcon } from 'icons';

const BookmarkNavigateButton: React.FC = () => {
    const { bookmarkedChunkId, setNavigateToBookmark } = useUIPreferencesStore();
    return (
        <Tooltip title="Go to bookmarked chunk" arrow>
            <span style={{ display: 'inline-flex' }}>
                <IconButton
                    onClick={() => bookmarkedChunkId && setNavigateToBookmark()}
                    disabled={!bookmarkedChunkId}
                    data-testid="goto-bookmark-button"
                >
                    <BookmarkIcon />
                </IconButton>
            </span>
        </Tooltip>
    );
};

export default BookmarkNavigateButton;
