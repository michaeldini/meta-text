/** 
 * Button to navigate to bookmarked chunk
 * (Located in the header of the metatext detail view)
 */

import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { TooltipButton } from 'components';
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
        <TooltipButton
            label="Go to Bookmark"
            tooltip="Navigate to the bookmarked chunk in this metatext"
            icon={<HiBookmark />}
            onClick={(event) => setNavigateToBookmark()}
            disabled={!bookmarkedChunkId}
            data-testid="goto-bookmark-button"
            color={bookmarkedChunkId ? 'primary' : 'default'}
        />

    );
}

export default BookmarkNavigateButton;