// Details for a given Metatext document.
// This page displays the details of a specific Metatext, including a header with style controls and document meta-data, the paginated chunks of the Metatext, and additional tools for chunk management.

// Uses a stack layout for the main content
// Tabs near the top to switch between different header sections
import React from 'react';
import type { ReactElement } from 'react';
import { Stack } from '@chakra-ui/react/stack';
import { Box } from '@chakra-ui/react/box';
import { Heading } from '@chakra-ui/react/heading';
import { Tabs } from '@chakra-ui/react/tabs';

// Imports for icons
import {
    HiAcademicCap,
    HiArrowDownTray,
    HiHashtag,
    HiStar,
    HiOutlineStar,
    HiBookmark
} from 'react-icons/hi2'


// Imports for components *** make a controls component for the header
import { SourceDocInfo } from '@components/SourceDocInfo';
import { StyleControls } from '@components/stylecontrols';
import { SearchContainer } from '@features/chunk-search';
import { TooltipButton } from '@components/TooltipButton';

// Import the bottom panel
import { ChunkToolsPanel } from '@features/chunk-tools';

// This gets the list of chunks for the metatext
import { usePaginatedChunks } from '@features/chunk';
import PaginatedChunks, { PaginatedChunksProps } from '@features/chunk/PaginatedChunks';

// Import the bookmark service and hooks
import { useBookmark } from '@hooks/useBookmark';
import useChunkBookmarkNavigation from '@features/chunk-bookmark/hooks/useChunkBookmarkNavigation';

// Custom hook for metatext detail page logic to keep this component clean
import { useMetatextDetailPage } from './hooks/useMetatextDetailPage';

function MetatextDetailPage(): ReactElement | null {
    // Use custom hook to encapsulate all setup logic
    const {
        metatextId,
        metatext,
        sourceDoc,
        showOnlyFavorites,
        setShowOnlyFavorites,
        updateUserConfig,
        uiPreferences,
        handleReviewClick,
        generateSourceDocInfo,
        downloadMetatext,
        setNavigateToBookmark,
        updateSourceDocMutation,
    } = useMetatextDetailPage();

    // Only proceed if metatextId is a number
    if (typeof metatextId !== 'number') {
        return null;
    }

    // Use the new bookmark hook for this metatext
    const { bookmarkedChunkId } = useBookmark(metatextId);

    // instead of deconstructuring the paginated chunks, we can just use the hook directly
    // this allows us to keep the paginated chunks logic encapsulated and clean, we will just pass the props to the PaginatedChunks component
    // Patch: convert chunksError to string if needed
    const rawChunksProps = usePaginatedChunks({ metatextId, showOnlyFavorites });
    const paginatedChunksProps: PaginatedChunksProps = {
        ...rawChunksProps,
        chunksError: rawChunksProps.chunksError instanceof Error ? rawChunksProps.chunksError.message : rawChunksProps.chunksError,
    };

    // Use the new navigation hook for bookmarks
    // You may need to pass chunks, chunksPerPage, setPage from paginatedChunksProps
    useChunkBookmarkNavigation(
        metatextId,
        paginatedChunksProps.displayChunks,
        paginatedChunksProps.chunksPerPage,
        paginatedChunksProps.setCurrentPage
    );

    // Wait for paginated chunks to load before rendering
    if (paginatedChunksProps.loadingChunks) {
        return null;
    }

    const headerContent = (
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <TooltipButton
                label="Go to Bookmark"
                tooltip="Navigate to the bookmarked chunk in this metatext"
                icon={<HiBookmark />}
                onClick={() => setNavigateToBookmark()}
                disabled={!bookmarkedChunkId}
                data-testid="goto-bookmark-button"
            />
            <TooltipButton
                label={showOnlyFavorites ? "Show All" : "Show Favorites"}
                tooltip={showOnlyFavorites ? "Show all chunks" : "Show only favorites"}
                icon={showOnlyFavorites ? <HiStar /> : <HiOutlineStar />}
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                aria-pressed={showOnlyFavorites}
                role="switch"
            />
            <TooltipButton
                label="Download"
                tooltip="Download MetaText as JSON"
                icon={<HiArrowDownTray />}
                onClick={downloadMetatext.handleDownload}
                disabled={downloadMetatext.disabled}
                loading={downloadMetatext.loading}
            />
            <TooltipButton
                label={uiPreferences?.showChunkPositions ? "Hide Positions" : "Show Positions"}
                tooltip={uiPreferences?.showChunkPositions ? "Hide chunk positions" : "Show chunk positions"}
                icon={<HiHashtag />}
                onClick={() => updateUserConfig.mutate({ showChunkPositions: !uiPreferences?.showChunkPositions })}
                role="switch"
                aria-checked={!!uiPreferences?.showChunkPositions}
                disabled={uiPreferences == null}
            />


            <SearchContainer showTagFilters={true} />

        </Box>
    );
    const tabsBlock = (
        <Tabs.Root variant="plain" maxW="md" fitted defaultValue={"Controls"}>
            <Tabs.List bg="bg.inverted">
                <Tabs.Trigger value="tab-1">Info</Tabs.Trigger>
                <Tabs.Trigger value="tab-2">Controls</Tabs.Trigger>
                <Tabs.Trigger value="tab-3">Styles</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="tab-1">
                {sourceDoc && (
                    <SourceDocInfo
                        doc={sourceDoc}
                        onDocumentUpdate={updateSourceDocMutation.mutate}
                        generateSourceDocInfo={generateSourceDocInfo}
                    />
                )}
            </Tabs.Content>
            <Tabs.Content value="tab-2">{headerContent}</Tabs.Content>
            <Tabs.Content value="tab-3">
                <StyleControls />
            </Tabs.Content>
        </Tabs.Root>
    );
    const reviewButton = (
        <TooltipButton
            label="Review"
            tooltip="Review this metatext"
            icon={<HiAcademicCap />}
            onClick={handleReviewClick}
            data-testid="review-button"
        />
    );

    return (
        <Box data-testid="metatext-detail-page" p="1" bg="bg.subtle">
            {metatext && (
                <Stack data-testid="metatext-detail-content" animationName="fade-in" animationDuration="fast">
                    <Stack direction="row" alignItems="center" >
                        <Heading size="md">metatext:</Heading>
                        <Heading size="3xl" color="fg.info">{metatext.title}</Heading>
                        {reviewButton}
                    </Stack>
                    {tabsBlock}
                    <ChunkToolsPanel />
                    <PaginatedChunks {...paginatedChunksProps} />
                </Stack>
            )}
        </Box>
    );
}

export default MetatextDetailPage;