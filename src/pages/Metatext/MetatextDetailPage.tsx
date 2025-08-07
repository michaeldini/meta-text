// Details for a given Metatext document.
// This page displays the details of a specific Metatext, including a header with style controls and document meta-data, the paginated chunks of the Metatext, and additional tools for chunk management.
import React, { useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Uses a stack layout for the main content
import type { ReactElement } from 'react';
import { Stack } from '@chakra-ui/react/stack';
import { Box } from '@chakra-ui/react/box';
import { Heading } from '@chakra-ui/react/heading';
import { Tabs } from '@chakra-ui/react/tabs';
import { Center } from '@chakra-ui/react/center';
import { Pagination } from '@chakra-ui/react/pagination';
import { ButtonGroup, IconButton } from '@chakra-ui/react/button';

// Imports for icons
import {
    HiAcademicCap,
    HiArrowDownTray,
    HiHashtag,
    HiStar,
    HiOutlineStar,
    HiBookmark,
    HiChevronLeft,
    HiChevronRight
} from 'react-icons/hi2'

// Imports for components *** make a controls component for the header
import { SourceDocInfo } from '@components/SourceDocInfo';
import { StyleControls } from '@components/stylecontrols';
import { SearchContainer } from '@features/chunk-search';
import { TooltipButton } from '@components/TooltipButton';
import { ChunkToolsPanel } from '@features/chunk-tools'; // Import the bottom panel
import Chunk from '@features/chunk/Chunk';

import { useUserConfig, useUpdateUserConfig } from '@services/userConfigService';

import { useMetatextDetail, useSourceDocumentDetail, useUpdateSourceDocument } from '@features/documents/useDocumentsData';
import { useSearchStore } from '@features/chunk-search/store/useSearchStore';
import { usePaginationStore } from '@features/chunk/hooks/usePaginationStore';
import { useSearchKeyboard } from '@features/chunk-search/hooks/useSearchKeyboard';

import { useGenerateSourceDocInfo } from '@hooks/useGenerateSourceDocInfo';
import { useDownloadMetatext } from './hooks/useDownloadMetatext';
import { useMetatextBookmark } from './hooks/useMetatextBookmark';

import getUiPreferences from '@utils/getUiPreferences';

import { useMetatextDetailStore } from '@store/metatextDetailStore';

import { ChunkType } from '@mtypes/documents';



let renderCount = 0;
function MetatextDetailPage(): ReactElement | null {
    console.log("MetatextDetailPage render count:", ++renderCount);
    // Use custom hook to encapsulate all setup logic

    // =========================
    // Routing & Navigation
    // =========================
    // Get metatextId from route params and parse to number
    const { metatextId } = useParams<{ metatextId?: string }>();
    const parsedId = metatextId ? Number(metatextId) : null;
    const navigate = useNavigate();

    // // State for showing only favorites
    const [showOnlyFavorites, setShowOnlyFavorites] = React.useState(false);
    // =========================
    // Early return if parsedId is invalid
    // =========================
    useEffect(() => {
        if (parsedId == null || isNaN(parsedId)) {
            navigate('/');
        }
    }, [parsedId, navigate]);
    if (parsedId == null || isNaN(parsedId)) return null;

    // // =========================
    // // User Config & UI Preferences
    // // =========================
    const { data: userConfig } = useUserConfig();
    const updateUserConfig = useUpdateUserConfig();
    const uiPreferences = getUiPreferences(userConfig);

    useSearchKeyboard({ enabled: true });
    const downloadMetatext = useDownloadMetatext(parsedId ?? undefined);
    const updateSourceDocMutation = useUpdateSourceDocument(parsedId);



    const { filteredChunks, isInSearchMode } = useSearchStore();
    const { currentPage, setCurrentPage, setChunksPerPage } = usePaginationStore();
    const prevChunksRef = useRef<any[]>([]);

    // // Use unified bookmark hook
    // Default values
    const chunksPerPage = 5;
    let displayChunks: ChunkType[] = [];
    let paginatedChunks: ChunkType[] = [];
    let pageCount = 0;
    let startIdx = 0;
    let endIdx = 0;

    const {
        bookmarkedChunkId,
        goToBookmark,
        bookmarkLoading,
    } = useMetatextBookmark(parsedId, displayChunks, chunksPerPage, setCurrentPage);

    // =========================
    // Data Fetching
    // =========================
    // Fetch metatext details and source document details
    const { data: metatext } = useMetatextDetail(parsedId);
    const { data: sourceDoc, invalidate } = useSourceDocumentDetail(metatext?.source_document_id);

    // =========================
    // State Management
    // =========================
    const currentMetatextId = useMetatextDetailStore((state) => state.metatextId);
    const setMetatextId = useMetatextDetailStore((state) => state.setMetatextId);

    React.useEffect(() => {
        if (parsedId !== currentMetatextId) {
            setMetatextId(parsedId);
        }
    }, [parsedId, currentMetatextId, setMetatextId]);

    const setMetatext = useMetatextDetailStore((state) => state.setMetatext);
    React.useEffect(() => {
        setMetatext(metatext ? metatext : null);
    }, [metatext, setMetatext]);

    const generateSourceDocInfo = useGenerateSourceDocInfo(metatext?.source_document_id, invalidate);

    const handleReviewClick = React.useCallback(() => {
        if (!metatext) return;
        navigate(`/metatext/${metatext.id}/review`);
    }, [metatext, navigate]);


    if (metatext?.chunks && metatext.chunks.length > 0) {
        displayChunks = isInSearchMode ? filteredChunks : metatext.chunks;
        if (showOnlyFavorites) {
            displayChunks = displayChunks.filter((chunk: ChunkType) => !!chunk.favorited_by_user_id);
        }
        pageCount = displayChunks.length;
        startIdx = (currentPage - 1) * chunksPerPage;
        endIdx = startIdx + chunksPerPage;
        paginatedChunks = displayChunks.slice(startIdx, endIdx);
        // const bookmarkedChunk = displayChunks.find((chunk: ChunkType) => !!chunk.bookmarked_by_user_id);
        // bookmarkedChunkId = bookmarkedChunk ? bookmarkedChunk.id : null;
    }

    useEffect(() => {
        setChunksPerPage(chunksPerPage);
    }, [setChunksPerPage]);

    useEffect(() => {
        if (currentPage > Math.ceil(pageCount / chunksPerPage) && pageCount > 0) {
            setCurrentPage(1);
        }
    }, [displayChunks, pageCount, currentPage, setCurrentPage, chunksPerPage]);

    // Wrapper for bookmark navigation to handle the setCurrentPage signature
    const handlePageChange = useCallback((page: React.SetStateAction<number>) => {
        if (typeof page === 'function') {
            setCurrentPage(page(currentPage));
        } else {
            setCurrentPage(page);
        }
    }, [currentPage, setCurrentPage]);

    // Preserve previous chunks for scroll position
    useEffect(() => {
        prevChunksRef.current = displayChunks;
    }, [displayChunks]);






    const headerContent = (
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <TooltipButton
                label="Go to Bookmark"
                tooltip="Navigate to the bookmarked chunk in this metatext"
                icon={<HiBookmark />}
                onClick={goToBookmark}
                disabled={!bookmarkedChunkId}
                loading={bookmarkLoading}
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
        </Box>
    );
    const tabsBlock = (
        <Tabs.Root
            variant="plain"
            maxW="md"
            deselectable
            // fitted
            defaultValue={"Controls"}
        >
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
                    <Stack direction="row" alignItems="start" justifyContent="space-between" >
                        {tabsBlock}
                        <SearchContainer showTagFilters={true} />
                    </Stack>
                    <ChunkToolsPanel />

                    <Box data-testid="chunks-container">
                        <Stack gap={4}>
                            <Center>
                                <Pagination.Root
                                    count={pageCount}
                                    pageSize={chunksPerPage}
                                    page={currentPage}
                                    onPageChange={e => setCurrentPage(e.page)}
                                >
                                    <ButtonGroup variant="ghost" color="fg" >
                                        <Pagination.PageText format='compact' />
                                        <Pagination.PrevTrigger asChild color="fg" >
                                            <IconButton aria-label="Previous page" >
                                                <HiChevronLeft />
                                            </IconButton>
                                        </Pagination.PrevTrigger>
                                        <Pagination.Items
                                            color="fg"
                                            render={({ value }) => (
                                                <IconButton
                                                    key={value}
                                                    variant={{ base: "ghost", _selected: "outline" }}
                                                    onClick={() => setCurrentPage(value)}
                                                >
                                                    {value}
                                                </IconButton>
                                            )}
                                        />
                                        <Pagination.NextTrigger asChild color="fg" >
                                            <IconButton aria-label="Next page">
                                                <HiChevronRight />
                                            </IconButton>
                                        </Pagination.NextTrigger>
                                    </ButtonGroup>
                                </Pagination.Root>
                            </Center>
                            {paginatedChunks.map((chunk: ChunkType, chunkIdx: number) => (
                                <Chunk
                                    key={chunk.id}
                                    chunk={chunk}
                                    chunkIdx={startIdx + chunkIdx}
                                />
                            ))}
                        </Stack>
                    </Box>
                </Stack>
            )}
        </Box>
    );

}

export default MetatextDetailPage;