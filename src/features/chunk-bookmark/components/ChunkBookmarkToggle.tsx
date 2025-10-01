/**
 * ChunkBookmarkToggle Component
 *
 * This component provides a button to toggle the bookmark status of a text chunk.
 * It uses the `useBookmark` hook to manage the bookmark state and provides visual feedback
 * 
 * Although seperate, `useChunkBookMarkNavigator` is related and works in conjunction with this component.
 * It provides navigation functionality to jump between bookmarked chunks within a metatext.
 * 
 * The button displays a filled bookmark icon when the chunk is bookmarked and an outlined icon when it is not.
 * It also handles loading states to prevent multiple rapid clicks during bookmark operations.
 */
import React from 'react';
import { HiBookmark, HiOutlineBookmark } from 'react-icons/hi2';
import { ChunkType } from '@mtypes/documents';
import { useBookmark } from '@features/chunk-bookmark/hooks/useBookmark';
import TooltipButton from '@components/ui/TooltipButton';

interface ChunkBookmarkToggleProps {
    chunk: ChunkType;
}

/**
 * ChunkBookmarkToggle Component
 * 
 * This component renders a button that allows users to toggle the bookmark status of a text chunk.
 * It uses the `useBookmark` hook to manage the bookmark state and provides visual feedback
 * through icon changes and tooltips.
 * The button displays a filled bookmark icon when the chunk is bookmarked and an outlined icon when it is not.
 * It also handles loading states to prevent multiple rapid clicks during bookmark operations.
 */
function ChunkBookmarkToggle({ chunk }: ChunkBookmarkToggleProps) {

    /**
     * useBookmark Hook
     *
     * This custom hook manages the bookmark state for chunks within a metatext.
     * It provides the ID of the currently bookmarked chunk, functions to set or remove a bookmark,
     * and loading states to indicate if a bookmark action is in progress.
     * 
     * The hook ensures that only one chunk can be bookmarked at a time within a given metatext.
     */
    const { bookmarkedChunkId, setBookmark, removeBookmark, isLoading } = useBookmark(chunk.metatext_id);

    /**
     * There can only be one bookmarked chunk per metatext.
     * Therefore, we check if the current chunk's ID matches the bookmarkedChunkId from the store.
     * If they match, this chunk is bookmarked; otherwise, it is not.
     * This logic ensures that the bookmark toggle accurately reflects the bookmark status of the chunk.
     */
    const isBookmarked = bookmarkedChunkId === chunk.id;

    /**
     * Handle toggling the bookmark status of the chunk.
     * 
     * If the chunk is currently bookmarked, calling removeBookmark will un-bookmark it.
     * If the chunk is not bookmarked, calling setBookmark with the chunk's ID will bookmark it.
     * 
     * This function is triggered when the user clicks the bookmark toggle button.
     * 
     */
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
            disabled={isLoading}
            loading={isLoading}
        />
    );
}

export default ChunkBookmarkToggle;