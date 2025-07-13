// Details for a given MetaText document.
// This page displays the details of a specific MetaText, including a header with style controls and document meta-data, the paginated chunks of the MetaText, and additional tools for chunk management.

import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, useTheme, Slide } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { ReactElement } from 'react';

import { PageContainer, ReviewButton, SourceDocInfo } from 'components';
import { ChunkToolsPanel } from 'features';
import { PaginatedChunks } from 'features';
import { useSourceDocDetailData } from 'hooks';
import { useSourceDocumentDetailStore } from 'store';
import { FADE_IN_DURATION } from 'constants';
import { useValidatedIdParam } from 'utils/urlValidation';

import { useMetaTextDetailData } from './hooks/useMetaTextDetailData';
import { getMetaTextDetailStyles } from './MetaText.styles';
import {
    GenerateSourceDocInfoButton,
    StyleControls,
    DocumentHeader,
} from 'components';


function MetaTextDetailPage(): ReactElement | null {
    // Extract the metaTextId from the URL parameters
    const { metaTextId } = useParams<{ metaTextId: string }>();

    // Validate the metaTextId parameter using robust validation utility
    const { id: validatedMetaTextId, isValid } = useValidatedIdParam(metaTextId);

    if (!isValid) {
        return null; // Could render a proper error component instead
    }

    // Fetch the metaText details using the custom hook
    const { metaText, loading } = useMetaTextDetailData(validatedMetaTextId ? String(validatedMetaTextId) : ""); // Todo handle errors

    // Fetch the source document details using the custom hook unconditionally
    const { doc: sourceDoc } = useSourceDocDetailData(
        metaText ? String(metaText.source_document_id) : ""
    );

    // Get the updateDoc function from the store for updating source document
    const { updateDoc } = useSourceDocumentDetailStore();

    const theme: Theme = useTheme();
    const styles = getMetaTextDetailStyles(theme);

    return (
        <PageContainer loading={loading} data-testid="metatext-detail-page">
            <Slide in={!!metaText} direction="up" timeout={FADE_IN_DURATION}>
                <Box sx={styles.container} data-testid="metatext-detail-content">
                    {metaText ? (
                        <>
                            <DocumentHeader title={metaText.title}>
                                <ReviewButton metaTextId={metaText.id} />
                                <GenerateSourceDocInfoButton
                                    sourceDocumentId={metaText.source_document_id}
                                />
                                <StyleControls />

                                {sourceDoc && (
                                    <SourceDocInfo doc={sourceDoc} onDocumentUpdate={updateDoc} />
                                )}
                            </DocumentHeader>

                            <PaginatedChunks metaTextId={metaText.id} />

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

export { MetaTextDetailPage };
export default MetaTextDetailPage;
