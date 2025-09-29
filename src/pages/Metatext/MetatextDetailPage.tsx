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
 * - (search + favorites filtering inlined)
 * - useChunkPagination: Manages pagination state for chunks.
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
import { useSearch } from '@features/chunk-search/hooks/useSearch';
import { useChunkPagination } from '@features/chunk/hooks/useChunkPagination';
import { useValidatedRouteId } from '@hooks/useValidatedRouteId';
import { useChunkToolsStore } from '@store/chunkToolsStore';
import { useChunkNavigationStore } from '@store/chunkNavigationStore';
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
     * 
     * - `useSearch` takes the metatext chunks and provides:
     *   - `results`: the chunks filtered by the current search query.
     *   - `isSearching`: boolean indicating if a search is in progress.
     * - `useSearch` internally manages the search query state via `useSearchStore`.
     * - We then apply additional filtering for favorites based on local state
     * 
     * `SearchBar` component uses `useSearch` internally to get/set the query.
     * `InteractiveText` components also use `useSearchStore` to highlight search terms.
    */
    const {
        focusSearch,       // focus-shortcut helper
        results: searchResults,
    } = useSearch(metatext?.chunks);


    /**
     * Setup favorites state and filtering.
     */
    const [showOnlyFavorites, setShowOnlyFavorites] = React.useState(false);

    /**
     * The chunks after applying search and filtering(favorites).
     * - If showOnlyFavorites is true, filter to only favorited chunks.
     * - Otherwise, use all search results.
     * - This ensures that both search and favorites filtering are applied together.
     * - The order is important: search first, then filter by favorites if needed.
     * - We only have one thing to filter on, favorited_by_user_id, so this is simple. In the future,
     *   if we add more filters, we may want to abstract this logic out.
     * 
     * @returns {ChunkType[]} The final list of chunks to display after search and filtering.
     */
    const processedChunks = showOnlyFavorites
        ? searchResults.filter(chunk => !!chunk.favorited_by_user_id)
        : searchResults;

    /**
     * ---------------------------------------------------------- 
     * Step 2: Paginate the processed chunks
     * ----------------------------------------------------------
     */

    /**
     * Pagination state and controls for processed chunks.
     * - Uses the useChunkPagination hook to manage pagination.
     * - Initializes to page 1 with 5 chunks per page.
     * @returns {object} Pagination state and helper functions.
     * 
     */
    const pager = useChunkPagination(processedChunks, 1, 5);

    // next/prev controls local to the page for clarity
    const nextPage = React.useCallback(() => {
        if (pager.hasNext) {
            pager.setCurrentPage(pager.currentPage + 1);
        }
    }, [pager.currentPage, pager.hasNext, pager.setCurrentPage]);

    const prevPage = React.useCallback(() => {
        if (pager.hasPrev) {
            pager.setCurrentPage(pager.currentPage - 1);
        }
    }, [pager.currentPage, pager.hasPrev, pager.setCurrentPage]);

    /**
     *  the toggleTool function from the chunk tools store to open/close chunk tools.
     */
    const toggleTool = useChunkToolsStore(state => state.toggleTool);

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
    useHotkeys(SHORTCUTS.NEXT_PAGE.key, nextPage, { enabled: pager.hasNext });
    useHotkeys(SHORTCUTS.PREV_PAGE.key, prevPage, { enabled: pager.hasPrev });
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

    // Handle external navigation requests (e.g., bookmarks) via store
    const requestedChunkId = useChunkNavigationStore(state => state.requestedChunkId);
    const clearNavigationRequest = useChunkNavigationStore(state => state.clearNavigationRequest);
    React.useEffect(() => {
        if (requestedChunkId !== null) {
            pager.goToChunkById(requestedChunkId);
            clearNavigationRequest();
        }
    }, [requestedChunkId, pager.goToChunkById, clearNavigationRequest]);

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
                        totalFilteredChunks={pager.totalFilteredChunks}
                        displayChunksCount={pager.displayChunks.length}
                        showOnlyFavorites={showOnlyFavorites}
                        setShowOnlyFavorites={setShowOnlyFavorites}
                    />

                    {/* the pager object contains all the chunk data */}
                    <ChunkDisplayContainer pager={pager} />


                </Column>
            )}
        </Box>
    );

}

export default MetatextDetailPage;