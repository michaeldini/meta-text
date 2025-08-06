// Click this toggle to bookmark or un-bookmark a chunk.

import React from 'react';
import { TooltipButton } from '@components/TooltipButton'
import { HiBookmark, HiOutlineBookmark } from 'react-icons/hi2';
import { ChunkType } from '@mtypes/documents';
import { useBookmark } from '@hooks/useBookmark';

interface ChunkBookmarkToggleProps {
    chunk: ChunkType;
}

function ChunkBookmarkToggle({ chunk }: ChunkBookmarkToggleProps) {

    const { bookmarkedChunkId, setBookmark, removeBookmark, isSetting, isRemoving } = useBookmark(chunk.metatext_id);

    const isBookmarked = bookmarkedChunkId === chunk.id;

    const handleToggle = () => {
        if (isBookmarked) {
            removeBookmark();
        } else {
            setBookmark(chunk.id);
        }
    };

    return (
        <TooltipButton
            label=""
            tooltip={isBookmarked ? "Remove Bookmark" : "Bookmark this chunk"}
            onClick={handleToggle}
            data-testid={`bookmark-toggle-${chunk.id}`}
            icon={isBookmarked ? <HiBookmark /> : <HiOutlineBookmark />}
            loading={isSetting || isRemoving}
            disabled={isSetting || isRemoving}
        />
    );
}

// Export the main component directly as default
export default ChunkBookmarkToggle;