import React from 'react';
import { HiOutlineStar, HiStar } from 'react-icons/hi2';
import { Box, Button } from '@styles';
import { tooltipContentStyles, tooltipArrowStyles } from '@styles';
import type { ChunkType } from '@mtypes/documents';
import useChunkFavoriteToggle from './useChunkFavoriteToggle';

interface ChunkFavoriteToggleProps {
    chunk: ChunkType;
}

function ChunkFavoriteToggle({ chunk }: ChunkFavoriteToggleProps) {
    const { loading, favorited, toggle: handleToggle } = useChunkFavoriteToggle(chunk);
    const [showTooltip, setShowTooltip] = React.useState(false);

    return (
        <Box css={{ position: 'relative', display: 'inline-block' }}>
            <Button
                aria-label={favorited ? 'Unfavorite' : 'Favorite'}
                onClick={handleToggle}
                size="lg"
                tone={favorited ? 'primary' : 'default'}
                css={{ p: 0, minWidth: 32, minHeight: 32 }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                disabled={loading}
            >
                {favorited ? <HiStar /> : <HiOutlineStar />}
            </Button>
            {showTooltip && (
                <Box css={{ ...tooltipContentStyles, position: 'absolute', top: '100%', left: 0, zIndex: 10 }}>
                    {favorited ? 'Unfavorite' : 'Favorite'}
                    <Box as="span" css={{ ...tooltipArrowStyles, position: 'absolute', top: -6, left: 10, width: 10, height: 6 }} />
                </Box>
            )}
        </Box>
    );
}

export default ChunkFavoriteToggle;