// Button to navigate to bookmarked chunk

import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { Tooltip } from 'components';
import { useBookmarkUIStore } from './bookmarkStore';
import { useBookmark } from 'features/documents/useBookmark';
import { BookmarkIcon } from 'icons';

interface BookmarkNavigateButtonProps {
    metaTextId: number;
}


export function BookmarkNavigateButton({ metaTextId }: BookmarkNavigateButtonProps) {
    const { setNavigateToBookmark } = useBookmarkUIStore();
    const { data: bookmarkedChunkId } = useBookmark(metaTextId);
    return (
        <Tooltip content="Go to bookmarked chunk">
            <span style={{ display: 'inline-flex' }}>
                <IconButton
                    onClick={() => bookmarkedChunkId && setNavigateToBookmark()}
                    disabled={!bookmarkedChunkId}
                    data-testid="goto-bookmark-button"
                    color={bookmarkedChunkId ? 'primary' : 'default'}
                >
                    <BookmarkIcon />
                </IconButton>
            </span>
        </Tooltip>
    );
}

export default BookmarkNavigateButton;