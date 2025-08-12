// Details for a given Metatext document.
// This page displays the details of a specific Metatext, including a header with style controls and document meta-data, the paginated chunks of the Metatext, and additional tools for chunk management.
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Uses a stack layout for the main content
import type { ReactElement } from 'react';
import { Stack } from '@chakra-ui/react/stack';
import { Box } from '@chakra-ui/react/box';
import { ErrorAlert } from '@components/ErrorAlert';

// Imports for components
import { ChunkToolsPanel } from '@features/chunk-tools';
import { MetatextHeader, MetatextControlTabs, ChunkDisplayContainer } from '@pages/Metatext/components';

import { useMetatextDetail } from '@features/documents/useDocumentsData';
import { useMetatextDetailKeyboard } from './hooks/useMetatextDetailKeyboard';

import { useChunkDisplay } from './hooks/useChunkDisplay';
import { useValidatedRouteId } from '@hooks/useValidatedRouteId';
function MetatextDetailPage(): ReactElement | null {


    // =========================
    // Routing & Navigation
    // =========================
    const navigate = useNavigate();
    // Validate route param and redirect if invalid
    const id = useValidatedRouteId('metatextId');
    if (id === null) return null;

    // =========================
    // Data Fetching
    // =========================
    // Fetch metatext details
    const { data: metatext, error } = useMetatextDetail(id);

    // =========================
    // Unified Chunk Display Logic
    // =========================
    const {
        displayChunks,
        totalFilteredChunks,
        chunksPerPage,
        currentPage,
        totalPages,
        setCurrentPage,
        startIndex,
        showOnlyFavorites,
        setShowOnlyFavorites,
        isSearchActive,
    } = useChunkDisplay({
        chunks: metatext?.chunks,
        chunksPerPage: 5
    });

    // =========================
    // Other handlers
    // =========================
    // review button is rendered inside MetatextHeader
    const handleReviewClick = React.useCallback(() => {
        if (id == null) return;
        navigate(`/metatext/${id}/review`);
    }, [id, navigate]);

    // =========================
    // Unified Keyboard Shortcuts (Navigation + Search)
    // =========================

    useMetatextDetailKeyboard({
        enabled: true,
        onNextPage: () => setCurrentPage(currentPage + 1),
        onPrevPage: () => setCurrentPage(currentPage - 1),
        onGotoReview: handleReviewClick,
        currentPage,
        totalPages,
        searchInputRef: undefined, // Could pass a ref here if needed
    });
    return (
        <Box data-testid="metatext-detail-page" paddingLeft="4" bg="bg">
            <ErrorAlert
                message={error ? (typeof error === 'string' ? error : (error as any)?.message || 'Something went wrong while fetching this metatext.') : null}
                title="Failed to load metatext"
                data-testid="metatext-detail-error"
                mb={4}
            />
            {metatext && (
                <Stack
                    data-testid="metatext-detail-content"
                    animationName="fade-in"
                    animationDuration="fast"
                >
                    <MetatextHeader title={metatext.title} onReviewClick={handleReviewClick} />

                    <MetatextControlTabs
                        metatextId={id}
                        sourceDocumentId={metatext?.source_document_id}
                        displayChunks={metatext?.chunks || []}
                        setCurrentPage={setCurrentPage}
                        showOnlyFavorites={showOnlyFavorites}
                        setShowOnlyFavorites={setShowOnlyFavorites}
                    />

                    <ChunkToolsPanel />

                    <ChunkDisplayContainer
                        displayChunks={displayChunks}
                        totalFilteredChunks={totalFilteredChunks}
                        chunksPerPage={chunksPerPage}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                        startIndex={startIndex}
                        isSearchActive={isSearchActive}
                    />
                </Stack>
            )}
        </Box>
    );

}

export default MetatextDetailPage;