// Details for a given Metatext document.
// This page displays the details of a specific Metatext, including a header with style controls and document meta-data, the paginated chunks of the Metatext, and additional tools for chunk management.

import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, useTheme, Slide } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { ReactElement } from 'react';

import { PageContainer, ReviewButton, SourceDocInfo } from 'components';
import { ChunkToolsPanel } from 'features';
import { PaginatedChunks } from 'features';
import { SearchContainer } from '../../features/chunk-search';
import { useSourceDocDetailData } from 'hooks';
import { useSourceDocumentDetailStore } from 'store';
import { FADE_IN_DURATION } from 'constants';
import { useValidatedIdParam } from 'utils/urlValidation';
import { useSearchKeyboard } from '../../features/chunk-search/hooks/useSearchKeyboard';

import { useMetatextDetailData } from './hooks/useMetatextDetailData';
import { getMetatextDetailStyles } from './Metatext.styles';
import {
    GenerateSourceDocInfoButton,
    StyleControls,
    DocumentHeader,
} from 'components';
import { useUIPreferencesStore } from 'store';
import BookmarkNavigateButton from '../../features/chunk-bookmark/BookmarkNavigateButton';


function MetatextDetailPage(): ReactElement | null {
    // Extract the metatextId from the URL parameters
    const { metatextId } = useParams<{ metatextId: string }>();

    // Validate the metatextId parameter using robust validation utility
    const { id: validatedMetatextId, isValid } = useValidatedIdParam(metatextId);

    if (!isValid) {
        return null; // Could render a proper error component instead
    }

    // Fetch the metatext details using the custom hook
    const { metatext, loading } = useMetatextDetailData(validatedMetatextId ? String(validatedMetatextId) : ""); // Todo handle errors

    // Fetch the source document details using the custom hook unconditionally
    const { doc: sourceDoc } = useSourceDocDetailData(
        metatext ? metatext.source_document_id : undefined
    );

    // Get the updateDoc function from the store for updating source document
    const { updateDoc } = useSourceDocumentDetailStore();

    const theme: Theme = useTheme();
    const styles = getMetatextDetailStyles(theme);
    // Call bookmark store hook to preserve hook order
    useUIPreferencesStore();

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
                                    <SourceDocInfo doc={sourceDoc} onDocumentUpdate={updateDoc} />
                                )}
                                <ReviewButton metatextId={metatext.id} />
                                <GenerateSourceDocInfoButton
                                    sourceDocumentId={metatext.source_document_id}
                                />
                                <StyleControls />
                                {/* Button to navigate to bookmarked chunk */}
                                <BookmarkNavigateButton />

                                <SearchContainer
                                    showTagFilters={true}
                                />
                            </DocumentHeader>

                            <PaginatedChunks metatextId={metatext.id} />

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
