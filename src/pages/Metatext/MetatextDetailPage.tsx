// Details for a given Metatext document.
// This page displays the details of a specific Metatext, including a header with style controls and document meta-data, the paginated chunks of the Metatext, and additional tools for chunk management.

// Uses a stack layout for the main content
import React from 'react';
import type { ReactElement } from 'react';
import { Stack } from '@chakra-ui/react/stack';
import { Box } from '@chakra-ui/react/box';
import { Heading } from '@chakra-ui/react/heading';

// Imports for icons
import {
    HiAcademicCap,
    HiArrowDownTray,
    HiOutlineSparkles,
    HiHashtag,
    HiStar,
    HiOutlineStar,
    HiBookmark
} from 'react-icons/hi2'


// Imports for components
import { SourceDocInfo } from '@components/SourceDocInfo';
import { StyleControls } from '@components/stylecontrols';
import { DocumentHeader } from '@components/DocumentHeader';
import { TooltipButton } from '@components/TooltipButton';

// Import the bottom panel
import { ChunkToolsPanel } from '@features/chunk-tools';

// Import the search input
import { SearchContainer } from '@features/chunk-search';

// This is the list of chunks for the metatext
import { usePaginatedChunks } from '@features/chunk';
import PaginatedChunks, { PaginatedChunksProps } from '@features/chunk/PaginatedChunks';
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

    return (
        <Box data-testid="metatext-detail-page" p="1" bg="bg.subtle">
            {metatext && (
                <Stack data-testid="metatext-detail-content" animationName="fade-in" animationDuration="fast">
                    <Heading size="xl">metatext</Heading>
                    <Heading size="6xl">{metatext.title}</Heading>
                    {sourceDoc && (
                        <SourceDocInfo
                            doc={sourceDoc}
                            onDocumentUpdate={updateSourceDocMutation.mutate}
                            generateSourceDocInfo={generateSourceDocInfo}
                        />
                    )}

                    <DocumentHeader title={metatext.title}>
                        <TooltipButton
                            label="Review"
                            tooltip="Review this metatext"
                            icon={<HiAcademicCap />}
                            onClick={handleReviewClick}
                        />
                        <TooltipButton
                            label="Generate Info"
                            tooltip="Generate or update document info using AI"
                            icon={<HiOutlineSparkles />}
                            onClick={generateSourceDocInfo.handleClick}
                            disabled={generateSourceDocInfo.loading}
                            loading={generateSourceDocInfo.loading}
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
                        <TooltipButton
                            label={showOnlyFavorites ? "Show All" : "Show Favorites"}
                            tooltip={showOnlyFavorites ? "Show all chunks" : "Show only favorites"}
                            icon={showOnlyFavorites ? <HiStar /> : <HiOutlineStar />}
                            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                            aria-pressed={showOnlyFavorites}
                            role="switch"
                        />
                        <TooltipButton
                            label="Go to Bookmark"
                            tooltip="Navigate to the bookmarked chunk in this metatext"
                            icon={<HiBookmark />}
                            onClick={() => setNavigateToBookmark()}
                            disabled={!bookmarkedChunkId}
                            data-testid="goto-bookmark-button"
                        />
                        <StyleControls />
                        <SearchContainer showTagFilters={true} />
                    </DocumentHeader>

                    <ChunkToolsPanel />
                    <PaginatedChunks {...paginatedChunksProps} />
                </Stack>
            )}
        </Box>
    );
}

export default MetatextDetailPage;