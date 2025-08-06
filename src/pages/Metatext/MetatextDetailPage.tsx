// Details for a given Metatext document.
// This page displays the details of a specific Metatext, including a header with style controls and document meta-data, the paginated chunks of the Metatext, and additional tools for chunk management.

// Uses a stack layout for the main content
// Tabs near the top to switch between different header sections
import React from 'react';
import type { ReactElement } from 'react';
import { Stack } from '@chakra-ui/react/stack';
import { Box } from '@chakra-ui/react/box';
import { Heading } from '@chakra-ui/react/heading';
import { Tabs } from '@chakra-ui/react/tabs';

import { useParams, useNavigate } from 'react-router-dom';
import { useUserConfig, useUpdateUserConfig } from '@services/userConfigService';
import { useMetatextDetail, useSourceDocumentDetail, useUpdateSourceDocument } from '@features/documents/useDocumentsData';
import { useSearchKeyboard } from '@features/chunk-search/hooks/useSearchKeyboard';
import { useGenerateSourceDocInfo } from '@hooks/useGenerateSourceDocInfo';
import { useDownloadMetatext } from './hooks/useDownloadMetatext';
import getUiPreferences from '@utils/getUiPreferences';

import { useMetatextDetailStore } from '@store/metatextDetailStore';
// Imports for icons
import {
    HiAcademicCap,
    HiArrowDownTray,
    HiHashtag,
    HiStar,
    HiOutlineStar,
    HiBookmark
} from 'react-icons/hi2'


// Imports for components *** make a controls component for the header
import { SourceDocInfo } from '@components/SourceDocInfo';
import { StyleControls } from '@components/stylecontrols';
import { SearchContainer } from '@features/chunk-search';
import { TooltipButton } from '@components/TooltipButton';

// Import the bottom panel
import { ChunkToolsPanel } from '@features/chunk-tools';

// This gets the list of chunks for the metatext
import { usePaginatedChunks } from '@features/chunk';
import PaginatedChunks, { PaginatedChunksProps } from '@features/chunk/PaginatedChunks';

// Import the bookmark service and hooks
import { useMetatextBookmark } from './hooks/useMetatextBookmark';

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

    // =========================
    // Early return if parsedId is invalid
    // =========================
    if (parsedId == null || isNaN(parsedId)) {
        React.useEffect(() => {
            navigate('/');
        }, [navigate]);
        return null;
    }

    // =========================
    // Data Fetching
    // =========================
    // Fetch metatext details and source document details
    const { data: metatext } = useMetatextDetail(parsedId);
    const { data: sourceDoc, invalidate } = useSourceDocumentDetail(metatext?.source_document_id);
    console.log("MetatextDetailPage render, metatext:", metatext);
    // =========================
    // State Management
    // =========================
    const currentMetatextId = useMetatextDetailStore((state) => state.metatextId);
    const setMetatextId = useMetatextDetailStore((state) => state.setMetatextId);

    // React.useEffect(() => {
    //     if (parsedId !== currentMetatextId) {
    //         setMetatextId(parsedId);
    //     }
    // }, [parsedId, currentMetatextId, setMetatextId]);

    const setMetatext = useMetatextDetailStore((state) => state.setMetatext);
    // React.useEffect(() => {
    //     setMetatext(metatext ? metatext : null);
    // }, [metatext, setMetatext]);

    // // State for showing only favorites
    const [showOnlyFavorites, setShowOnlyFavorites] = React.useState(false);

    // // =========================
    // // User Config & UI Preferences
    // // =========================
    const { data: userConfig } = useUserConfig();
    const updateUserConfig = useUpdateUserConfig();
    const uiPreferences = getUiPreferences(userConfig);

    // // =========================
    // // Keyboard Shortcuts
    // // =========================
    useSearchKeyboard({ enabled: true });

    // // =========================
    // // Source Document Info Generation
    // // =========================
    const generateSourceDocInfo = useGenerateSourceDocInfo(metatext?.source_document_id, invalidate);

    // // =========================
    // // Download
    // // =========================
    const downloadMetatext = useDownloadMetatext(parsedId ?? undefined);

    // // =========================
    // // Mutations
    // // =========================
    const updateSourceDocMutation = useUpdateSourceDocument(parsedId);

    // // =========================
    // // Navigation Handlers
    // // =========================
    const handleReviewClick = React.useCallback(() => {
        if (!metatext) return;
        navigate(`/metatext/${metatext.id}/review`);
    }, [metatext, navigate]);


    // // Paginated chunks props
    // // Pass chunks from metatext to usePaginatedChunks
    const rawChunksProps = usePaginatedChunks({
        chunks: metatext?.chunks ?? [],
        showOnlyFavorites,
    });
    const paginatedChunksProps: PaginatedChunksProps = {
        ...rawChunksProps,
    };

    // // Use unified bookmark hook
    const {
        bookmarkedChunkId,
        goToBookmark,
        bookmarkLoading,
    } = useMetatextBookmark(parsedId, paginatedChunksProps);



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
            <SearchContainer showTagFilters={true} />
        </Box>
    );
    const tabsBlock = (
        <Tabs.Root variant="plain" maxW="md" fitted defaultValue={"Controls"}>
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
                    {tabsBlock}
                    <ChunkToolsPanel />
                    <PaginatedChunks {...paginatedChunksProps} />
                </Stack>
            )}
        </Box>
    );

}

export default MetatextDetailPage;