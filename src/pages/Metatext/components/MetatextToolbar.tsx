/**
 * Toolbar for the metatext detail page
 * 
 * Mostly a collection of buttons and hooks/functions/state for the buttons to act on.
 * 
 * Uses Radix UI Toolbar: https://www.radix-ui.com/docs/primitives/components/toolbar
 * 
 * @module MetatextToolbar
 */
import React, { useState } from 'react';

/**
 * These imports are dropped in as is or with props. No setup is needed.
 * 
 * KeyboardShortcutsDisplay: Button to show keyboard shortcuts/help menu.
 * SourceDocInfoDisplay: Button to show info about the source document.
 * StyleTools: Button to show style tools (e.g., toggle chunk positions).
 * ReviewMetatextButton: Button to navigate to the review page for the metatext.
 */
import { KeyboardShortcutsDisplay, SourceDocInfoDisplay, UserConfigTools } from '@components';
import { ReviewMetatextButton } from './ReviewMetatextButton';

/** Hook to download the metatext in JSON format */
import { useDownloadMetatext } from '@pages/Metatext/hooks/useDownloadMetatext';

/** 
 * Hook to get the bookmark state used to navigate to the bookmarked chunk.
 * 
*/
import { useBookmark } from '@hooks/useBookmark';
import { useChunkFiltersStore } from '@features/chunk/hooks/useChunkFiltersStore';
import { useChunkNavigationStore } from '@store/chunkNavigationStore';
import { useChunkToolsPanel } from '@features/chunk-tools/useChunkToolsPanel';
import { ChunkStatusInfo } from './ChunkStatusInfo';
import { TooltipButton } from '@components/ui/TooltipButton';
import { HiArrowDownTray, HiBookmark, HiOutlineStar, HiStar, HiViewfinderCircle } from 'react-icons/hi2';
import * as Toolbar from '@radix-ui/react-toolbar';
import { styled } from '@styles';

const StyledToolbarRoot = styled(Toolbar.Root, {
    display: 'flex',
    alignItems: 'center',
    // gap: '12px',
    padding: '8px',
    backgroundColor: 'gray',
    borderRadius: '6px',
    flexWrap: 'wrap',
    boxShadow: '5px 10px 3px 0px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
    variants: {
        sticky: {
            true: {
                position: 'sticky',
                top: 0,
            },
            false: {
                position: 'static',
            }
        }
    },
    defaultVariants: {
        sticky: true,
    }
});

const StyledSeparator = styled(Toolbar.Separator, {
    width: '1px',
    height: '24px',
    backgroundColor: '$border',
    margin: '0 4px'
});

interface MetaTextToolbarProps {
    metatextId: number;
    sourceDocumentId?: number;
    totalFilteredChunks: number;
    displayChunksCount: number;
    isSearching?: boolean;
}

export function MetatextToolbar({
    metatextId,
    sourceDocumentId,
    totalFilteredChunks,
    displayChunksCount,
    isSearching = false,
}: MetaTextToolbarProps) {
    // Local state for sticky toggle
    const [isSticky, setIsSticky] = useState(true);

    // Download functionality
    const downloadMetatext = useDownloadMetatext(metatextId);

    // Favorites state from store
    const showOnlyFavorites = useChunkFiltersStore((s) => s.showOnlyFavorites);
    const setShowOnlyFavorites = useChunkFiltersStore((s) => s.setShowOnlyFavorites);

    // Navigation store for bookmark navigation
    const requestNavigateToChunk = useChunkNavigationStore(state => state.requestNavigateToChunk);

    // Chunk tools panel logic
    const { activeTabs, chunkToolsRegistry, handleToolClick } = useChunkToolsPanel();

    // Bookmark state (direct)
    const { bookmarkedChunkId, isLoading: bookmarkLoading } = useBookmark(metatextId);
    const goToBookmark = () => {
        if (!bookmarkedChunkId) return;
        // Use the navigation store to request navigation - this will trigger page change + scroll
        requestNavigateToChunk(bookmarkedChunkId);
    };

    return (
        <StyledToolbarRoot
            orientation="horizontal"
            data-testid="metatext-header"
            sticky={isSticky}
        >
            <Toolbar.Button asChild>
                <TooltipButton
                    label=""
                    tooltip="Navigate to the bookmarked chunk in this metatext"
                    icon={<HiBookmark />}
                    onClick={goToBookmark}
                    disabled={!bookmarkedChunkId}
                    loading={bookmarkLoading}
                    data-testid="goto-bookmark-button"
                />
            </Toolbar.Button>
            <Toolbar.Button asChild>
                <TooltipButton
                    label=""
                    tooltip={showOnlyFavorites ? "Show all chunks" : "Show only favorites"}
                    icon={showOnlyFavorites ? <HiStar /> : <HiOutlineStar />}
                    onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                    aria-pressed={showOnlyFavorites}
                    role="switch"
                />
            </Toolbar.Button>

            {/* Chunk Tools */}
            <StyledSeparator />

            {chunkToolsRegistry.map((tool) => (
                <Toolbar.Button key={tool.id} asChild>
                    <TooltipButton
                        label="" // {tool.name}
                        tooltip={tool.tooltip}
                        icon={tool.icon}
                        onClick={() => handleToolClick(tool.id)}
                        tone={activeTabs.includes(tool.id) ? 'primary' : 'default'}
                        role="button"
                        aria-label={tool.name}
                    />
                </Toolbar.Button>
            ))}

            <StyledSeparator />

            <Toolbar.Button asChild>
                <ReviewMetatextButton />
            </Toolbar.Button>
            <Toolbar.Button asChild>
                <KeyboardShortcutsDisplay />
            </Toolbar.Button>
            <Toolbar.Button asChild>
                <TooltipButton
                    label=""
                    tooltip="Download MetaText as JSON"
                    icon={<HiArrowDownTray />}
                    onClick={() => void downloadMetatext.handleDownload()}
                    disabled={downloadMetatext.disabled}
                    loading={downloadMetatext.loading}
                />
            </Toolbar.Button>
            <Toolbar.Button asChild>
                <SourceDocInfoDisplay sourceDocumentId={sourceDocumentId} />
            </Toolbar.Button>
            <StyledSeparator />

            {/* tools for adjusting UI preferences */}
            <UserConfigTools showShowChunkPositions />

            <StyledSeparator />

            {/* Chunk Status and Search */}
            <ChunkStatusInfo
                totalFilteredChunks={totalFilteredChunks}
                displayChunksCount={displayChunksCount}
                isSearching={isSearching}
            />
            <StyledSeparator />
            <Toolbar.Button asChild>
                <TooltipButton
                    label=""
                    tooltip={isSticky ? "Make toolbar non-sticky" : "Make toolbar sticky"}
                    icon={<HiViewfinderCircle />}
                    onClick={() => setIsSticky(!isSticky)}
                    tone={isSticky ? 'primary' : 'default'}
                    role="switch"
                    aria-checked={isSticky}
                />
            </Toolbar.Button>
        </StyledToolbarRoot>
    );
}