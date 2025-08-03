// Details for a given Metatext document.
// This page displays the details of a specific Metatext, including a header with style controls and document meta-data, the paginated chunks of the Metatext, and additional tools for chunk management.
// Favorite chunk filter toggle now uses TooltipButton for a consistent UI.
import React from 'react';
import type { ReactElement } from 'react';
import { Stack } from '@chakra-ui/react/stack';
import { Heading } from '@chakra-ui/react';

import { HiAcademicCap, HiArrowDownTray, HiOutlineSparkles, HiHashtag, HiStar, HiOutlineStar, HiBookmark } from 'react-icons/hi2'

import { PageContainer } from '@components/PageContainer';
import { SourceDocInfo } from '@components/SourceDocInfo';
import { StyleControls } from '@components/stylecontrols';
import { DocumentHeader } from '@components/DocumentHeader';
import { TooltipButton } from '@components/TooltipButton';

import { ChunkToolsPanel } from '@features/chunk-tools';
import { SearchContainer } from '@features/chunk-search';
import { usePaginatedChunks } from '@features/chunk';
import PaginatedChunks, { PaginatedChunksProps } from '../../features/chunk/PaginatedChunks';

import { useMetatextDetailPage } from './hooks/useMetatextDetailPage';
import { useBookmarkUIStore } from '@features/chunk-bookmark/store/bookmarkStore';

function MetatextDetailPage(): ReactElement | null {
    // Use custom hook to encapsulate all setup logic
    const {
        metatextId,
        metatext,
        metatextIsLoading,
        sourceDoc,
        showOnlyFavorites,
        setShowOnlyFavorites,
        updateUserConfig,
        uiPreferences,
        handleReviewClick,
        generateSourceDocInfo,
        downloadMetatext,
    } = useMetatextDetailPage();


    const { setNavigateToBookmark } = useBookmarkUIStore();

    // instead of deconstructuring the paginated chunks, we can just use the hook directly
    // this allows us to keep the paginated chunks logic encapsulated and clean, we will just pass the props to the PaginatedChunks component
    const paginatedChunksProps: PaginatedChunksProps = usePaginatedChunks({ metatextId, showOnlyFavorites });


    // Wait for paginated chunks to load before rendering
    if (paginatedChunksProps.loadingChunks) {
        return null
    };

    return (
        <PageContainer data-testid="metatext-detail-page">
            {metatext && (
                <Stack data-testid="metatext-detail-content"

                    animationName="fade-in"
                    animationDuration="fast">
                    <Heading size="xl">metatext</Heading>
                    <Heading size="6xl">
                        {metatext.title}
                    </Heading>
                    {sourceDoc && <SourceDocInfo doc={sourceDoc} />}

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
                            tooltip='Download MetaText as JSON'
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
                            disabled={!paginatedChunksProps.bookmarkedChunkId}
                            data-testid="goto-bookmark-button"
                        />
                        <StyleControls />
                        <SearchContainer showTagFilters={true} />
                    </DocumentHeader>

                    <ChunkToolsPanel />
                    <PaginatedChunks {...paginatedChunksProps} />
                </Stack>
            )}
        </PageContainer>
    );
}

export default MetatextDetailPage;