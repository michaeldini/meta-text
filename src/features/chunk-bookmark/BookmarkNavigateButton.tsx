// Button to navigate to bookmarked chunk
// Extracted from MetatextDetailPage for cleaner code

import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useBookmarkUIStore } from 'store/bookmarkStore';
import { useBookmark } from 'features/documents/useBookmark';
import { BookmarkIcon } from 'icons';

interface BookmarkNavigateButtonProps {
    metaTextId: number;
}

const BookmarkNavigateButton: React.FC<BookmarkNavigateButtonProps> = ({ metaTextId }) => {
    const { setNavigateToBookmark } = useBookmarkUIStore();
    const { data: bookmarkedChunkId } = useBookmark(metaTextId);
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
