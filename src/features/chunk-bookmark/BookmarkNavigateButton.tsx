// Button to navigate to bookmarked chunk

import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { Tooltip } from 'components';
import { useBookmarkUIStore } from './bookmarkStore';
import { useBookmark } from 'features/documents/useBookmark';
import { HiBookmark } from "react-icons/hi2";

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
                    variant="ghost"
                >
                    <HiBookmark />
                </IconButton>
            </span>
        </Tooltip>
    );
}

export default BookmarkNavigateButton;