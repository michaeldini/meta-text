// Details for a given Metatext document.
// This page displays the details of a specific Metatext, including a header with style controls and document meta-data, the paginated chunks of the Metatext, and additional tools for chunk management.
import React from 'react';
import type { ReactElement } from 'react';
import { Stack } from '@chakra-ui/react/stack';


import { HiAcademicCap } from 'react-icons/hi2'

import { PageContainer, SourceDocInfo, StyleControls, DocumentHeader, TooltipButton } from 'components';

import { ChunkToolsPanel, PaginatedChunks, SearchContainer, BookmarkNavigateButton, ChunkFavoriteFilterToggle, ChunkPositionToggleButton } from 'features';

import DownloadMetatextButton from './components/DownloadMetatextButton';
import { useMetatextDetailPage } from './useMetatextDetailPage';


function MetatextDetailPage(): ReactElement | null {
    // Use custom hook to encapsulate all setup logic
    const {
        metatext,
        isLoading,
        sourceDoc,
        showOnlyFavorites,
        setShowOnlyFavorites,
        updateUserConfig,
        uiPreferences,
        handleReviewClick,
        generateSourceDocInfo,
    } = useMetatextDetailPage();

    return (
        <PageContainer loading={isLoading} data-testid="metatext-detail-page">
            {metatext && (
                <Stack data-testid="metatext-detail-content">
                    <DocumentHeader title={metatext.title}>

                        <TooltipButton
                            label="Review"
                            icon={<HiAcademicCap />}
                            tooltip="Review this metatext"
                            onClick={handleReviewClick}
                        />
                        <TooltipButton
                            label="Generate Info"
                            tooltip="Generate or update document info using AI"
                            onClick={generateSourceDocInfo.handleClick}
                            disabled={generateSourceDocInfo.loading}
                            loading={generateSourceDocInfo.loading}
                        />
                        <StyleControls />
                        <ChunkPositionToggleButton
                            value={uiPreferences.showChunkPositions || false}
                            onChange={val => updateUserConfig.mutate({ showChunkPositions: val })}
                        />
                        <BookmarkNavigateButton metaTextId={metatext.id} />
                        <DownloadMetatextButton metatextId={metatext.id} />
                        <ChunkFavoriteFilterToggle
                            showOnlyFavorites={showOnlyFavorites}
                            onToggle={setShowOnlyFavorites}
                        />
                        <SearchContainer showTagFilters={true} />
                        {sourceDoc && <SourceDocInfo doc={sourceDoc} />}
                    </DocumentHeader>
                    <ChunkToolsPanel />
                    <PaginatedChunks metatextId={metatext.id} showOnlyFavorites={showOnlyFavorites} />
                </Stack>
            )}
        </PageContainer>

    );
}

export default MetatextDetailPage;
