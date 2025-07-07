import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, useTheme, Alert, Fade, Typography } from '@mui/material';

import { log } from 'utils';
import { ErrorBoundary, LoadingBoundary, PageContainer, ReviewButton } from 'components';
import { usePageLogger } from 'hooks';
import { ChunkToolsNavbar, SourceDocInfo } from 'features';
import { Chunks } from 'features';
import { FADE_IN_DURATION } from 'constants';
import { useMetaTextDetailData } from 'store';

import { getMetaTextPageStyles } from './MetaText.styles';
import { GenerateSourceDocInfoButton, StyleControls, DocumentHeader } from 'components';

export default function MetaTextDetailPage() {
    const { metaTextId } = useParams<{ metaTextId: string }>();
    if (!metaTextId || Number.isNaN(Number(metaTextId))) {
        return null;
    }

    const theme = useTheme();
    const styles = getMetaTextPageStyles(theme);

    // Fetch MetaText detail using unified naming
    const { metaText, loading, errors } = useMetaTextDetailData(metaTextId);

    return (
        <ErrorBoundary>
            <LoadingBoundary loading={loading}>
                <PageContainer>
                    {metaText ? (
                        <Fade in={!loading} timeout={FADE_IN_DURATION}>
                            <Box sx={styles.container}>
                                <DocumentHeader title={metaText.title} >
                                    <ReviewButton metaTextId={metaText.id} />
                                    <GenerateSourceDocInfoButton
                                        sourceDocumentId={metaText.source_document_id}
                                    />
                                    <StyleControls />
                                    <SourceDocInfo
                                        sourceDocumentId={metaText.source_document_id}
                                    />
                                </DocumentHeader>
                                <Chunks metaTextId={metaText.id} />
                                <ChunkToolsNavbar />
                            </Box>
                        </Fade>
                    ) : null}
                </PageContainer>
            </LoadingBoundary>
        </ErrorBoundary>
    );
}
