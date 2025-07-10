// Details for a given MetaText document.
// This page displays the details of a specific MetaText, including a header with style controls and document meta-data, the paginated chunks of the MetaText, and additional tools for chunk management.

import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, useTheme, Slide } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { ReactElement } from 'react';

import { PageContainer, ReviewButton, SourceDocInfo } from 'components';
import { ChunkToolButtons } from 'features';
import { PaginatedChunks } from 'features';
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

    // Validate the metaTextId to ensure it's a number
    // If it's not a valid number, return null to avoid rendering the page
    if (!metaTextId || Number.isNaN(Number(metaTextId))) {
        return null;
    }

    // Fetch the metaText details using the custom hook
    const { metaText, loading } = useMetaTextDetailData(metaTextId); // Todo handle errors

    const theme: Theme = useTheme();
    const styles = getMetaTextDetailStyles(theme);

    return (
        <PageContainer loading={loading} data-testid="metatext-detail-page">
            <Slide in={!!metaText} direction="up" timeout={500}>
                <Box sx={styles.container} data-testid="metatext-detail-content">
                    {metaText ? (
                        <>
                            <DocumentHeader title={metaText.title}>
                                <ReviewButton metaTextId={metaText.id} />
                                <GenerateSourceDocInfoButton
                                    sourceDocumentId={
                                        metaText.source_document_id
                                    }
                                />
                                <StyleControls />
                                <SourceDocInfo
                                    sourceDocumentId={
                                        metaText.source_document_id
                                    }
                                />
                            </DocumentHeader>

                            <PaginatedChunks metaTextId={metaText.id} />

                            <ChunkToolButtons />
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
