// Details for a given Metatext document.
// This page displays the details of a specific Metatext, including a header with style controls and document meta-data, the paginated chunks of the Metatext, and additional tools for chunk management.
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Uses a stack layout for the main content
import type { ReactElement } from 'react';
import { Stack } from '@chakra-ui/react/stack';
import { Box } from '@chakra-ui/react/box';
import { Heading } from '@chakra-ui/react/heading';
import { Text } from '@chakra-ui/react/text';
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

import { useMetatextDetail } from '@features/documents/useDocumentsData';
import { useSearchKeyboard } from '@features/chunk-search/hooks/useSearchKeyboard';

import { useDownloadMetatext } from './hooks/useDownloadMetatext';
import { useMetatextBookmark } from './hooks/useMetatextBookmark';
import { useChunkDisplay } from './hooks/useChunkDisplay';

import getUiPreferences from '@utils/getUiPreferences';

import { ChunkType } from '@mtypes/documents';



let renderCount = 0;
function MetatextDetailPage(): ReactElement | null {
    console.log("MetatextDetailPage render count:", ++renderCount);
    // Use custom hook to encapsulate all setup logic

    // =========================
    // Routing & Navigation
    // =========================
    // Get metatextId from route params and use as single source of truth
    const { metatextId } = useParams<{ metatextId?: string }>();
    const navigate = useNavigate();
    // Early return if metatextId is invalid
    if (!metatextId || isNaN(Number(metatextId))) {
        React.useEffect(() => { navigate('/'); }, [navigate]);
        return null;
    }
    const id = Number(metatextId);

    // =========================
    // User Config & UI Preferences
    // =========================
    const { data: userConfig } = useUserConfig();
    const updateUserConfig = useUpdateUserConfig();
    const uiPreferences = getUiPreferences(userConfig);

    useSearchKeyboard({ enabled: true });
    const downloadMetatext = useDownloadMetatext(id);

    // =========================
    // Data Fetching
    // =========================
    // Fetch metatext details
    const { data: metatext } = useMetatextDetail(id);

    // =========================
    // Unified Chunk Display Logic
    // =========================
    const {
        displayChunks,
        totalFilteredChunks,
        currentPage,
        totalPages,
        setCurrentPage,
        startIndex,
        showOnlyFavorites,
        setShowOnlyFavorites,
    } = useChunkDisplay({
        chunks: metatext?.chunks,
        chunksPerPage: 5
    });

    // =========================
    // Bookmark functionality
    // =========================
    const {
        bookmarkedChunkId,
        goToBookmark,
        bookmarkLoading,
    } = useMetatextBookmark(id, displayChunks, 5, setCurrentPage);

    // =========================
    // Other handlers
    // =========================
    const handleReviewClick = React.useCallback(() => {
        if (!metatext) return;
        navigate(`/metatext/${metatext.id}/review`);
    }, [metatext, navigate]);

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
            w="100%"
            deselectable
            fitted
            defaultValue={"Controls"}
        >
            <Tabs.List bg="bg.inverted">
                <Tabs.Trigger value="tab-1">Info</Tabs.Trigger>
                <Tabs.Trigger value="tab-2">Controls</Tabs.Trigger>
                <Tabs.Trigger value="tab-3">Styles</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="tab-1">
                <SourceDocInfo sourceDocumentId={metatext?.source_document_id} />
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
        <Box data-testid="metatext-detail-page" paddingLeft="4" bg="bg.subtle">
            {metatext && (
                <Stack data-testid="metatext-detail-content" animationName="fade-in" animationDuration="fast">
                    <Stack direction="row" alignItems="center" >
                        <Heading size="md">metatext:</Heading>
                        <Heading size="3xl" color="fg.info">{metatext.title}</Heading>
                        {reviewButton}
                    </Stack>
                    <Stack direction="row" alignItems="start" justifyContent="space-between" >
                        {tabsBlock}
                    </Stack>
                    <ChunkToolsPanel />

                    <Box data-testid="chunks-container">
                        <Stack gap={4}>
                            {/* Chunk count and status info */}
                            <Center>
                                <SearchContainer />
                                <Text fontSize="sm" color="fg.muted">
                                    {totalFilteredChunks === 0
                                        ? "No chunks found with current filters"
                                        : `Showing ${displayChunks.length} of ${totalFilteredChunks} chunks`
                                    }
                                </Text>
                            </Center>

                            {totalFilteredChunks > 0 && (
                                <Center>
                                    <Pagination.Root
                                        count={totalPages}
                                        pageSize={5}
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
                            )}

                            {displayChunks.map((chunk: ChunkType, chunkIdx: number) => (
                                <Chunk
                                    key={chunk.id}
                                    chunk={chunk}
                                    chunkIdx={startIndex + chunkIdx}
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