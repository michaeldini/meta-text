// Details for a given Metatext document.
// This page displays the details of a specific Metatext, including a header with style controls and document meta-data, the paginated chunks of the Metatext, and additional tools for chunk management.
// Favorite chunk filter toggle now uses TooltipButton for a consistent UI.
import React from 'react';
import type { ReactElement } from 'react';
import { Stack } from '@chakra-ui/react/stack';
import { Skeleton, SkeletonText, SkeletonCircle, Box } from '@chakra-ui/react';

import { HiAcademicCap, HiArrowDownTray, HiOutlineSparkles, HiHashtag, HiStar, HiOutlineStar, HiBookmark } from 'react-icons/hi2'

import { PageContainer, SourceDocInfo, StyleControls, DocumentHeader, TooltipButton } from 'components';
import { ChunkToolsPanel, SearchContainer, usePaginatedChunks } from 'features';
import PaginatedChunks, { PaginatedChunksProps } from '../../features/chunk/PaginatedChunks';

import { useMetatextDetailPage } from './hooks/useMetatextDetailPage';


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
        setNavigateToBookmark,
        bookmarkedChunkId,
    } = useMetatextDetailPage();

    const paginatedChunksProps: PaginatedChunksProps = usePaginatedChunks({ metatextId, showOnlyFavorites });


    if (paginatedChunksProps.loadingChunks) {
        return null
    };
    //     // Skeleton mimics the layout: header, controls, and chunk list
    //     return (
    //         <PageContainer loading data-testid="metatext-detail-page">
    //             <Stack gap={6} padding={8}>
    //                 {/* Header skeleton */}
    //                 <Skeleton height="36px" width="40%" />
    //                 {/* Toolbar skeleton (icons/buttons) */}
    //                 <Stack direction="row" gap={4}>
    //                     {[...Array(7)].map((_, i) => (
    //                         <SkeletonCircle key={i} size="10" />
    //                     ))}
    //                 </Stack>
    //                 {/* Style controls/search/source doc info skeletons */}
    //                 <Skeleton height="32px" width="60%" />
    //                 <Skeleton height="24px" width="50%" />
    //                 <Skeleton height="32px" width="80%" />
    //                 {/* Chunk tools panel skeleton */}
    //                 <Skeleton height="48px" width="100%" />
    //                 {/* Paginated chunks skeleton */}
    //                 <Box>
    //                     <SkeletonText noOfLines={8} gap="4" />
    //                 </Box>
    //             </Stack>
    //         </PageContainer>
    //     );
    // }

    return (
        <PageContainer loading={metatextIsLoading} data-testid="metatext-detail-page">
            {metatext && (
                <Stack data-testid="metatext-detail-content"

                    animationName="fade-in"
                    animationDuration="fast">
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
                            disabled={!bookmarkedChunkId}
                            data-testid="goto-bookmark-button"
                        />
                        <StyleControls />
                        <SearchContainer showTagFilters={true} />
                        {sourceDoc && <SourceDocInfo doc={sourceDoc} />}
                    </DocumentHeader>
                    <ChunkToolsPanel />
                    <PaginatedChunks {...paginatedChunksProps} />
                </Stack>
            )}
        </PageContainer>
    );
}

export default MetatextDetailPage;