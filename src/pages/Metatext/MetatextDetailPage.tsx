// Details for a given Metatext document.
// This page displays the details of a specific Metatext, including a header with style controls and document meta-data, the paginated chunks of the Metatext, and additional tools for chunk management.

import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, useTheme, Slide } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { ReactElement } from 'react';

import {
    PageContainer, ReviewButton, SourceDocInfo, GenerateSourceDocInfoButton,
    StyleControls,
    DocumentHeader,
    AppAlert,
} from 'components';
import { useUserConfig, useUpdateUserConfig } from 'services/userConfigService';

import { ChunkToolsPanel, PaginatedChunks, SearchContainer, BookmarkNavigateButton } from 'features';

import { FADE_IN_DURATION } from 'constants';
import { useValidatedIdParam } from 'utils/urlValidation';



import { useSearchKeyboard, useMetatextDetail, ChunkFavoriteFilterToggle, useSourceDocumentDetail, ChunkPositionToggleButton } from 'features';

import { getMetatextDetailStyles } from './Metatext.styles';
import DownloadMetatextButton from './components/DownloadMetatextButton';


function MetatextDetailPage(): ReactElement | null {
    // Extract the metatextId from the URL parameters
    // Validate the metatextId parameter using robust validation utility
    const { metatextId } = useParams<{ metatextId: string }>();
    const { id: validatedMetatextId, isValid } = useValidatedIdParam(metatextId);


    const [showOnlyFavorites, setShowOnlyFavorites] = React.useState(false);

    // Fetch the metatext details using the new React Query hook
    const { data: metatext, isLoading: loading } = useMetatextDetail(validatedMetatextId ?? null);

    // Fetch the source document details using the new React Query hook
    // Only fetch, do not provide update logic
    const { data: sourceDoc } = useSourceDocumentDetail(
        metatext ? metatext.source_document_id ?? null : null
    );

    const theme: Theme = useTheme();
    const styles = getMetatextDetailStyles(theme);
    // Hydrate user config (UI preferences) for downstream components
    useUserConfig();

    // Initialize keyboard shortcuts for search
    useSearchKeyboard({ enabled: true });

    const { data: userConfig, isLoading } = useUserConfig();
    const updateUserConfig = useUpdateUserConfig();
    const uiPreferences = userConfig?.uiPreferences || {
        showChunkPositions: false,
    };

    let content;
    if (metatext) {
        content = (
            <Slide in={true} direction="up" timeout={FADE_IN_DURATION}>
                <Box sx={styles.container} data-testid="metatext-detail-content">
                    <DocumentHeader title={metatext.title}>
                        {sourceDoc && <SourceDocInfo doc={sourceDoc} />}
                        <ReviewButton metatextId={metatext.id} />
                        <GenerateSourceDocInfoButton sourceDocumentId={metatext.source_document_id} />
                        <StyleControls />
                        {/* Button to navigate to bookmarked chunk and toggle chunk position */}
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
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
                        </Box>
                        <SearchContainer showTagFilters={true} />
                    </DocumentHeader>
                    <PaginatedChunks metatextId={metatext.id} showOnlyFavorites={showOnlyFavorites} />
                    <ChunkToolsPanel />
                </Box>
            </Slide>
        );
    } else if (!isValid) {
        content = (
            <Box sx={styles.container} data-testid="metatext-detail-error">
                <AppAlert severity="error">
                    Invalid metatext ID provided.
                </AppAlert>
            </Box>
        );
    } else {
        content = (
            <Box sx={styles.container} data-testid="metatext-detail-notfound">
                <AppAlert severity="info">
                    Metatext not found.
                </AppAlert>
            </Box>
        );
    }

    return (
        <PageContainer loading={loading} data-testid="metatext-detail-page">
            {content}
        </PageContainer>
    );
}

export { MetatextDetailPage };
export default MetatextDetailPage;
