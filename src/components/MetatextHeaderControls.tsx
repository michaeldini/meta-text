// Header controls for the Metatext detail page
// Contains bookmark navigation, favorites toggle, download, and position display controls
// Self-contained component that manages its own state via hooks

import React from 'react';
import { Box } from '@chakra-ui/react/box';
import {
    HiArrowDownTray,
    HiHashtag,
    HiStar,
    HiOutlineStar,
    HiBookmark,
} from 'react-icons/hi2';

import { TooltipButton } from '@components/TooltipButton';
import { useUserConfig, useUpdateUserConfig } from '@services/userConfigService';
import { useDownloadMetatext } from '@pages/Metatext/hooks/useDownloadMetatext';
import { useMetatextBookmark } from '@pages/Metatext/hooks/useMetatextBookmark';
import getUiPreferences from '@utils/getUiPreferences';
import { ChunkType } from '@mtypes/documents';

interface MetatextHeaderControlsProps {
    metatextId: number;
    // Props for coordination with parent component
    displayChunks: ChunkType[]; // For bookmark navigation
    setCurrentPage: (page: number) => void; // For bookmark navigation
    showOnlyFavorites: boolean; // From parent's chunk display logic
    setShowOnlyFavorites: (show: boolean) => void; // From parent's chunk display logic
}

export function MetatextHeaderControls({
    metatextId,
    displayChunks,
    setCurrentPage,
    showOnlyFavorites,
    setShowOnlyFavorites,
}: MetatextHeaderControlsProps): React.ReactElement {
    // Self-contained state management via hooks
    const { data: userConfig } = useUserConfig();
    const updateUserConfig = useUpdateUserConfig();
    const uiPreferences = getUiPreferences(userConfig);

    // Download functionality
    const downloadMetatext = useDownloadMetatext(metatextId);

    // Bookmark functionality
    const {
        bookmarkedChunkId,
        goToBookmark,
        bookmarkLoading,
    } = useMetatextBookmark(metatextId, displayChunks, 5, setCurrentPage);

    return (
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
                onClick={() => void downloadMetatext.handleDownload()}
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
}

export default MetatextHeaderControls;
