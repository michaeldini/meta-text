// Details for a given Metatext document.
// This page displays the details of a specific Metatext, including a header with style controls and document meta-data, the paginated chunks of the Metatext, and additional tools for chunk management.
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Uses a stack layout for the main content
import type { ReactElement } from 'react';
import { Column, Box, Heading } from '@styles';
import { ErrorAlert } from '@components/ErrorAlert';

// Imports for components
import { MetatextHeader, ChunkDisplayContainer } from '@pages/Metatext/components';

import { useMetatextDetail } from '@features/documents/useDocumentsData';
import { useMetatextDetailKeyboard } from './hooks/useMetatextDetailKeyboard';

import { useProcessedChunks } from './hooks/useProcessedChunks';
import { usePaginatedChunks } from './hooks/usePaginatedChunks';
import { useValidatedRouteId } from '@hooks/useValidatedRouteId';

function MetatextDetailPage(): ReactElement | null {


    // =========================
    // Routing & Navigation
    // =========================
    const navigate = useNavigate();
    // Validate route param and redirect if invalid
    const id = useValidatedRouteId('metatextId');

    // =========================
    // Data Fetching
    // =========================
    // Fetch metatext details
    const { data: metatext, error } = useMetatextDetail(id);

    // =========================
    // Unified Chunk Display Logic (Split into focused hooks)
    // =========================

    // Step 1: Process chunks (search + filtering)
    const {
        processedChunks,
        isSearching,
    } = useProcessedChunks({
        chunks: metatext?.chunks,
        minQueryLength: 2,
    });

    // Step 2: Paginate the processed chunks
    const {
        displayChunks,
        totalFilteredChunks,
        chunksPerPage,
        currentPage,
        totalPages,
        setCurrentPage,
        startIndex,
    } = usePaginatedChunks({
        processedChunks,
        initialChunksPerPage: 5,
    });


    // =========================
    // Other handlers
    // =========================
    // review button navigates itself; keep a handler only for keyboard shortcut
    const goToReview = React.useCallback(() => {
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
        onGotoReview: goToReview,
        currentPage,
        totalPages,
        searchInputRef: undefined, // Could pass a ref here if needed
    });
    // Redirect if query error (invalid or not found)
    if (id === null) return null;
    return (
        <Box
            data-testid="metatext-detail-page"
            p="2"
        >
            <ErrorAlert
                message={error ? (typeof error === 'string' ? error : (error && typeof error === 'object' && 'message' in error ? String((error as { message?: unknown }).message) : 'Something went wrong while fetching this metatext.')) : null}
                title="Failed to load metatext"
                data-testid="metatext-detail-error"
            />
            {metatext && (
                <Column
                    data-testid="metatext-detail-content"
                    gap="1"
                >
                    <Heading >metatext: {metatext.title}</Heading>
                    <MetatextHeader
                        metatextId={id}
                        sourceDocumentId={metatext?.source_document_id}
                        totalFilteredChunks={totalFilteredChunks}
                        displayChunksCount={displayChunks.length}
                        isSearching={isSearching}
                    />

                    <ChunkDisplayContainer
                        displayChunks={displayChunks}
                        chunksPerPage={chunksPerPage}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                        startIndex={startIndex}
                    />

                    {/* <ChunkToolsPanel /> */}

                </Column>
            )}
        </Box>
    );

}

export default MetatextDetailPage;