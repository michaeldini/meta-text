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
 * - useHotkeys: Sets up keyboard shortcuts for navigation (from react-hotkeys-hook).
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
import { useNavigate, generatePath } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import type { ReactElement } from 'react';
import { ErrorAlert } from '@components/ErrorAlert';
import { MetatextToolbar, ChunkDisplayContainer } from './components';
import { useMetatextDetail } from '@features/documents/useDocumentsData';
import { useProcessedChunks } from './hooks/useProcessedChunks';
import { useChunkPaginationWithNavigation } from './hooks/useChunkPaginationWithNavigation';
import { useValidatedRouteId } from '@hooks/useValidatedRouteId';
import { useSearchStore } from '@features/chunk-search/store/useSearchStore';
import { useChunkToolsStore } from '@store/chunkToolsStore';
import { SHORTCUTS } from '@utils/keyboardShortcuts';
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

        /** Current page number. */
        currentPage,

        /** Total number of pages based on filtered chunks and chunks per page. */
        totalPages,

        /** Function to navigate to the next page. */
        nextPage,

        /** Function to navigate to the previous page. */
        prevPage,

        /** Whether there is a previous page available. */
        hasPrev,
        /** Whether there is a next page available. */
        hasNext,
        /** Alias for a safe clamped page jump (1-based). */
        gotoPage,

    } = useChunkPaginationWithNavigation({

        /** The chunks that have been processed (filtered/searched). */
        processedChunks,

        /** Number of chunks to display per page. */
        initialChunksPerPage: 5,
    });

    /**
     *  the toggleTool function from the chunk tools store to open/close chunk tools.
     */
    const toggleTool = useChunkToolsStore(state => state.toggleTool);

    /**
     * Function to focus the search input, enhancing user experience.
     */
    const focusSearch = useSearchStore(state => state.focusSearch);

    /**
     * Navigate to the review page for the current metatext.
     * - Constructs the path using the metatext ID.
     * - Uses the navigate function from react-router-dom to change routes.
     */
    const goToReview = React.useCallback(() => {
        if (id == null) return;
        const path = generatePath('/metatext/:metatextId/review', { metatextId: String(id) });
        navigate(path);
    }, [id, navigate]);


    /**
     * ----------------------------------------------------------
     * Keyboard Shortcuts
     * ----------------------------------------------------------
     */

    /**
     * alt+Right Arrow: Next Page (if not on last page)
     * alt+Left Arrow: Previous Page (if not on first page)
     * alt+i: Go to Review Page
     * alt+k: Focus Search Input
     */
    useHotkeys(SHORTCUTS.NEXT_PAGE.key, nextPage, { enabled: currentPage < totalPages });
    useHotkeys(SHORTCUTS.PREV_PAGE.key, prevPage, { enabled: currentPage > 1 });
    useHotkeys(SHORTCUTS.GOTO_REVIEW.key, goToReview);
    useHotkeys(SHORTCUTS.FOCUS_SEARCH.key, focusSearch);

    /**
    * alt+1-6: Toggle Chunk Tools
    * 1: Note Summary
    * 2: Evaluation
    * 3: Image Generation
    * 4: Rewrite
    * 5: Explanation
    */
    useHotkeys(SHORTCUTS.NOTE_SUMMARY.key, () => toggleTool('note-summary'));
    useHotkeys(SHORTCUTS.EVALUATION.key, () => toggleTool('evaluation'));
    useHotkeys(SHORTCUTS.IMAGE.key, () => toggleTool('image'));
    useHotkeys(SHORTCUTS.REWRITE.key, () => toggleTool('rewrite'));
    useHotkeys(SHORTCUTS.EXPLANATION.key, () => toggleTool('explanation'));


    /**
     * if the ID is null (invalid), return null to avoid rendering.
     */
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
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={gotoPage}
                        hasPrev={hasPrev}
                        hasNext={hasNext}
                    />


                </Column>
            )}
        </Box>
    );

}

export default MetatextDetailPage;