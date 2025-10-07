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
import { UserConfigTools } from '@features/user-config/UserConfigTools';
import { KeyboardShortcutsDisplay } from '@features/keyboard-shortcuts/KeyboardShortcutsDisplay';
import { SourceDocInfoDisplay } from '@features/sourcedoc-info/SourceDocInfo';
import { ReviewMetatextButton } from './ReviewMetatextButton';

/** Hook to download the metatext in JSON format */
import { useDownloadMetatext } from '@pages/Metatext/hooks/useDownloadMetatext';

/** 
 * Hook to get the bookmark state used to navigate to the bookmarked chunk.
 * 
*/
import { useBookmark } from '@features/chunk-bookmark';
import { SearchBar } from '@features/chunk-search';
import { useChunkNavigationStore } from '@store/chunkNavigationStore';
import { Button, Tooltip } from '@components';
import { HiArrowDownTray, HiBookmark, HiOutlineStar, HiStar, HiViewfinderCircle } from 'react-icons/hi2';
import * as Toolbar from '@radix-ui/react-toolbar';

import { styled } from '@styles';
import { useChunkToolsStore } from '@store/chunkToolsStore';
import { chunkToolsRegistry, type ChunkToolId } from '@features/chunk-tools/toolsRegistry';


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
    showOnlyFavorites: boolean;
    setShowOnlyFavorites: (show: boolean) => void;
}

export function MetatextToolbar({
    metatextId,
    sourceDocumentId,
    showOnlyFavorites,
    setShowOnlyFavorites,
}: MetaTextToolbarProps) {

    // Local state for sticky toggle
    const [isSticky, setIsSticky] = useState(true);
    // Download functionality
    const downloadMetatext = useDownloadMetatext(metatextId);

    // Navigation store for bookmark navigation
    const requestNavigateToChunk = useChunkNavigationStore(state => state.requestNavigateToChunk);

    // State from store
    const activeTabs = useChunkToolsStore(state => state.activeTools);
    const setActiveTabs = useChunkToolsStore(state => state.setActiveTools);


    // Toggle tool selection
    const handleToolClick = (toolId: ChunkToolId) => {
        if (activeTabs.includes(toolId)) {
            setActiveTabs(activeTabs.filter(id => id !== toolId));
        } else {
            setActiveTabs([...activeTabs, toolId]);
        }
    };
    // Bookmark state (direct)
    const { bookmarkedChunkId } = useBookmark(metatextId);

    const goToBookmark = () => {
        if (!bookmarkedChunkId) return;
        // Use the navigation store to request navigation - this will trigger page change + scroll
        requestNavigateToChunk(bookmarkedChunkId);
    };

    return (
        <StyledToolbarRoot
            id="metatext-toolbar"
            orientation="horizontal"
            data-testid="metatext-toolbar"
            sticky={isSticky}
        >
            <Toolbar.Button asChild>
                <Tooltip content={bookmarkedChunkId ? "Go to bookmarked chunk" : "No bookmarked chunk"}>
                    <Button
                        icon={<HiBookmark />}
                        onClick={goToBookmark}
                        disabled={!bookmarkedChunkId}
                        aria-label="Go to bookmarked chunk"
                    />
                </Tooltip>

            </Toolbar.Button>

            <Toolbar.Button asChild>
                <Tooltip content={showOnlyFavorites ? "Show all chunks" : "Show only favorites"}>
                    <Button
                        icon={showOnlyFavorites ? <HiStar /> : <HiOutlineStar />}
                        onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                        aria-pressed={showOnlyFavorites}
                        role="switch"
                    />
                </Tooltip>
            </Toolbar.Button>
            <StyledSeparator />

            {/* Chunk Tools */}
            {chunkToolsRegistry.map((tool) => (
                <Toolbar.Button key={tool.id} asChild>
                    <Tooltip content={tool.tooltip}>
                        <Button
                            icon={tool.icon}
                            onClick={() => handleToolClick(tool.id)}
                            tone={activeTabs.includes(tool.id) ? 'primary' : 'default'}
                            aria-pressed={activeTabs.includes(tool.id)}
                            role="button"
                            aria-label={tool.name}
                        />
                    </Tooltip>
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
                <Tooltip content="Download MetaText as JSON">
                    <Button
                        icon={<HiArrowDownTray />}
                        onClick={() => void downloadMetatext.handleDownload()}
                        disabled={downloadMetatext.disabled}
                        aria-label="Download metatext"
                    />
                </Tooltip>
            </Toolbar.Button>

            <Toolbar.Button asChild>
                <SourceDocInfoDisplay sourceDocumentId={sourceDocumentId} />
            </Toolbar.Button>
            <StyledSeparator />

            {/* tools for adjusting UI preferences */}
            <UserConfigTools showShowChunkPositions />
            <StyledSeparator />


            {/* Chunk Status and Search */}
            <SearchBar />
            <StyledSeparator />

            <Toolbar.Button asChild>
                <Tooltip content={isSticky ? "Make toolbar non-sticky" : "Make toolbar sticky"}>
                    <Button
                        icon={<HiViewfinderCircle />}
                        onClick={() => setIsSticky(!isSticky)}
                        tone={isSticky ? 'primary' : 'default'}
                        role="switch"
                        aria-checked={isSticky}
                    />
                </Tooltip>
            </Toolbar.Button>
        </StyledToolbarRoot>
    );
}