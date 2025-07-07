import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, useTheme, Alert, Fade, Typography, Slide } from '@mui/material';

import { log } from 'utils';
import { LoadingBoundary, PageContainer, ReviewButton } from 'components';
import { usePageLogger } from 'hooks';
import { ChunkToolsNavbar, SourceDocInfo } from 'features';
import { Chunks } from 'features';
import { FADE_IN_DURATION } from 'constants';
import { useMetaTextDetailData } from './useMetaTextDetailData';

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
        <PageContainer loading={loading}>
            {metaText ? (
                <Slide in={true} direction="up" timeout={500}>
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
                </Slide>
            ) : null}
        </PageContainer>
    );
}
