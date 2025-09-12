// Click this toggle to bookmark or un-bookmark a chunk.

import React from 'react';
import { Box } from '@styles';
import { HiBookmark, HiOutlineBookmark } from 'react-icons/hi2';
import { ChunkType } from '@mtypes/documents';
import { useBookmark } from '@hooks/useBookmark';
import TooltipButton from '../../../components/TooltipButton';

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
            tooltip={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            icon={isBookmarked ? <HiBookmark /> : <HiOutlineBookmark />}
            onClick={handleToggle}
            tone={isBookmarked ? 'primary' : 'default'}
            disabled={isSetting || isRemoving}
        />
    );
}

export default ChunkBookmarkToggle;