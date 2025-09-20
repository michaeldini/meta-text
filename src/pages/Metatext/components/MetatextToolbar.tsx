// Header component for Metatext detail page displaying title and review button
import React, { useState } from 'react';
import { HiArrowDownTray, HiBookmark, HiHashtag, HiOutlineStar, HiStar, HiViewfinderCircle } from 'react-icons/hi2';
import * as Toolbar from '@radix-ui/react-toolbar';
import { styled } from '@styles';

import { KeyboardShortcutsDisplay, SourceDocInfoDisplay, StyleTools } from '@components';
import { TooltipButton } from '@components/ui/TooltipButton';

import { ReviewMetatextButton } from './ReviewMetatextButton';
import { useUserConfig, useUpdateUserConfig } from '@services/userConfigService';
import { useDownloadMetatext } from '@pages/Metatext/hooks/useDownloadMetatext';
import { useBookmark } from '@hooks/useBookmark';
import getUiPreferences from '@utils/getUiPreferences';
import { useChunkFiltersStore } from '@features/chunk/hooks/useChunkFiltersStore';
import { useChunkNavigationStore } from '@store/chunkNavigationStore';
import { useChunkToolsPanel } from '@features/chunk-tools/useChunkToolsPanel';
import { ChunkStatusInfo } from './ChunkStatusInfo';

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

    // Self-contained state management via hooks from MetatextHeaderControls
    const { data: userConfig } = useUserConfig();
    const updateUserConfig = useUpdateUserConfig();
    const uiPreferences = getUiPreferences(userConfig);

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
            <Toolbar.Button asChild>
                <TooltipButton
                    label=""
                    tooltip={uiPreferences?.showChunkPositions ? "Hide chunk positions" : "Show chunk positions"}
                    icon={<HiHashtag />}
                    onClick={() => updateUserConfig.mutate({ showChunkPositions: !uiPreferences?.showChunkPositions })}
                    role="switch"
                    aria-checked={!!uiPreferences?.showChunkPositions}
                    disabled={uiPreferences == null}
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
                <KeyboardShortcutsDisplay categories={['Navigation', 'Interface']} />
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
            <Toolbar.Button asChild>
                <StyleTools />
            </Toolbar.Button>
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