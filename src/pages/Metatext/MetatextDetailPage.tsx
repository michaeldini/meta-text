/**
 * Metatext Detail Page
 * 
 * - Fetches and displays details of a specific metatext, including its chunks.
 * - Supports searching and pagination of chunks.
 * - Includes keyboard shortcuts for navigation and review.
 * 
 * Components:
 * - MetatextToolbar: Displays all toolbar actions (bookmark, favorites, download, search).
 * - ChunkDisplayContainer: Handles displaying, paginating, and searching chunks.
 * 
 * Hooks:
 * - useMetatextDetail: Fetches metatext details by ID.
 * - useProcessedChunks: Processes chunks based on search query.
 * - usePaginatedChunks: Manages pagination state for chunks.
 * - useValidatedRouteId: Validates the metatext ID from route params.
 * - useMetatextDetailKeyboard: Sets up keyboard shortcuts for navigation.
 * 
 * Error Handling:
 * - Displays an error alert if fetching the metatext fails.
 * 
 * Note:
 * - Redirects to home if the metatext ID is invalid or not found.
 * 
 * 
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import { ErrorAlert } from '@components/ErrorAlert';
import { MetatextToolbar, ChunkDisplayContainer } from './components';
import { useMetatextDetail } from '@features/documents/useDocumentsData';
import { useMetatextDetailKeyboard } from './hooks/useMetatextDetailKeyboard';
import { useProcessedChunks } from './hooks/useProcessedChunks';
import { usePaginatedChunks } from './hooks/usePaginatedChunks';
import { useValidatedRouteId } from '@hooks/useValidatedRouteId';
import { Column, Box, Heading } from '@styles';

function MetatextDetailPage(): ReactElement | null {

    /**
     * - Provides a navigate function for programmatic navigation.
     */
    const navigate = useNavigate();

    /**
     * Validate and extract the metatext ID from the route parameters.
     * - If the ID is invalid, it returns null.
     * - This ensures that the component only attempts to fetch data for valid IDs.
     * 
     * @returns {number | null} The validated metatext ID or null if invalid.
     */
    const id = useValidatedRouteId('metatextId');

    /**
     * Fetch metatext details using the validated ID.
     * - Uses the useMetatextDetail hook to fetch data.
     * 
     * @returns {object} The metatext data, loading state, and error state.
     */
    const { data: metatext, error } = useMetatextDetail(id);


    /** 
     * ----------------------------------------------------------
     * Step 1: Process chunks (search + filtering) 
     * ----------------------------------------------------------
    */
    const {
        /**
         * The processed chunks after applying search and filtering.
         */
        processedChunks,

        /**
         * Indicates if a search operation is currently active.
         */
        isSearching,

    } = useProcessedChunks({

        /**
         * The original chunks from the fetched metatext.
         */
        chunks: metatext?.chunks,

        /**
         * Minimum query length to trigger search.
         */
        minQueryLength: 2,
    });

    /**
     * ---------------------------------------------------------- 
     * Step 2: Paginate the processed chunks
     * ----------------------------------------------------------
     */
    const {

        /** The chunks to be displayed on the current page. */
        displayChunks,

        /** Total number of chunks after filtering/searching. */
        totalFilteredChunks,

        /** Number of chunks to display per page. */
        chunksPerPage,

        /** Current page number. */
        currentPage,

        /** Total number of pages based on filtered chunks and chunks per page. */
        totalPages,

        /** Function to set the current page. */
        setCurrentPage,

        /** The starting index of the chunks for the current page. */
        startIndex,


    } = usePaginatedChunks({

        /** The chunks that have been processed (filtered/searched). */
        processedChunks,

        /** Number of chunks to display per page. */
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
            {error && <ErrorAlert
                message='Something went wrong while fetching this metatext.'
                title="Failed to load metatext"
                data-testid="metatext-detail-error"
            />}
            {metatext && (
                <Column
                    data-testid="metatext-detail-content"
                    gap="1"
                >
                    <Heading >metatext: {metatext.title}</Heading>
                    <MetatextToolbar
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