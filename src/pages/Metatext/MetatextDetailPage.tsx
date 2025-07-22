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
} from 'components';

import { ChunkToolsPanel, PaginatedChunks, SearchContainer, BookmarkNavigateButton } from 'features';

// import { useSourceDocDetailData } from 'hooks';
// import { useSourceDocumentDetailStore, useBookmarkStore } from 'store';
import { useUserConfig } from 'services/userConfigService';
import { FADE_IN_DURATION } from 'constants';
import { useValidatedIdParam } from 'utils/urlValidation';



import { useSearchKeyboard } from '../../features/chunk-search/hooks/useSearchKeyboard';
import { useMetatextDetail } from 'features/documents/useMetatextDetail';
import { getMetatextDetailStyles } from './Metatext.styles';
import DownloadMetatextButton from './components/DownloadMetatextButton';
import { ChunkFavoriteFilterToggle } from 'features';
import { useSourceDocumentDetail } from 'features/documents/useSourceDocumentDetail';
import { useBookmarkUIStore } from 'store/bookmarkStore';

function MetatextDetailPage(): ReactElement | null {
    // Extract the metatextId from the URL parameters
    const { metatextId } = useParams<{ metatextId: string }>();

    const [showOnlyFavorites, setShowOnlyFavorites] = React.useState(false);
    // Validate the metatextId parameter using robust validation utility
    const { id: validatedMetatextId, isValid } = useValidatedIdParam(metatextId);

    if (!isValid) {
        return null; // Could render a proper error component instead
    }

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

    return (
        <PageContainer loading={loading} data-testid="metatext-detail-page">
            <Slide in={!!metatext} direction="up" timeout={FADE_IN_DURATION}>
                <Box sx={styles.container} data-testid="metatext-detail-content">
                    {metatext ? (
                        <>
                            <DocumentHeader
                                title={metatext.title}
                            >
                                {sourceDoc && (
                                    <SourceDocInfo doc={sourceDoc} />
                                )}
                                <ReviewButton metatextId={metatext.id} />
                                <GenerateSourceDocInfoButton
                                    sourceDocumentId={metatext.source_document_id}
                                />
                                <StyleControls />

                                {/* Button to navigate to bookmarked chunk and toggle chunk position */}
                                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                                    <BookmarkNavigateButton metaTextId={metatext.id} />
                                    <DownloadMetatextButton metatextId={metatext.id} />
                                    <ChunkFavoriteFilterToggle
                                        showOnlyFavorites={showOnlyFavorites}
                                        onToggle={setShowOnlyFavorites}
                                    />
                                </Box>

                                <SearchContainer
                                    showTagFilters={true}
                                />
                            </DocumentHeader>

                            <PaginatedChunks metatextId={metatext.id} showOnlyFavorites={showOnlyFavorites} />

                            <ChunkToolsPanel />
                        </>
                    ) : (
                        <div />
                    )}
                </Box>
            </Slide>
        </PageContainer>
    );
}

export { MetatextDetailPage };
export default MetatextDetailPage;
