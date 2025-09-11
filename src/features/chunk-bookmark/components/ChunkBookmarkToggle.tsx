// Click this toggle to bookmark or un-bookmark a chunk.

import React, { useState } from 'react';
import { Box, Button } from '@styles';
import { tooltipContentStyles, tooltipArrowStyles } from '@styles';
import { HiBookmark, HiOutlineBookmark } from 'react-icons/hi2';
import { ChunkType } from '@mtypes/documents';
import { useBookmark } from '@hooks/useBookmark';

interface ChunkBookmarkToggleProps {
    chunk: ChunkType;
}

function ChunkBookmarkToggle({ chunk }: ChunkBookmarkToggleProps) {
    const { bookmarkedChunkId, setBookmark, removeBookmark, isSetting, isRemoving } = useBookmark(chunk.metatext_id);
    const isBookmarked = bookmarkedChunkId === chunk.id;
    const [showTooltip, setShowTooltip] = useState(false);

    const handleToggle = () => {
        if (isBookmarked) {
            removeBookmark();
        } else {
            setBookmark(chunk.id);
        }
    };

    return (
        <Box css={{ position: 'relative', display: 'inline-block' }}>
            <Button
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                onClick={handleToggle}
                size="sm"
                tone={isBookmarked ? 'primary' : 'default'}
                css={{ p: 0, minWidth: 32, minHeight: 32 }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                disabled={isSetting || isRemoving}
            >
                {isBookmarked ? <HiBookmark /> : <HiOutlineBookmark />}
            </Button>
            {showTooltip && (
                <Box css={{ ...tooltipContentStyles, position: 'absolute', top: '100%', left: 0, zIndex: 10 }}>
                    {isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                    <Box as="span" css={{ ...tooltipArrowStyles, position: 'absolute', top: -6, left: 10, width: 10, height: 6 }} />
                </Box>
            )}
        </Box>
    );
}

export default ChunkBookmarkToggle;