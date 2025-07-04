import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, useTheme, Alert, Fade } from '@mui/material';

import { log } from 'utils';
import { ErrorBoundary, LoadingBoundary, PageContainer } from 'components';
import { usePageLogger } from 'hooks';
import { ChunkToolsNavbar } from 'features';
import { Chunks } from 'features';
import { FADE_IN_DURATION } from 'constants';
import { useMetaTextDetail } from 'store';

import { MetaTextHeader } from './components';
import { getMetaTextPageStyles } from './MetaText.styles';

export default function MetaTextDetailPage() {
    const { metaTextId } = useParams<{ metaTextId: string }>();
    if (!metaTextId || Number.isNaN(Number(metaTextId))) {
        return null;
    }

    const theme = useTheme();
    const styles = getMetaTextPageStyles(theme);

    // Fetch MetaText detail directly
    const { metaText, loading, errors } = useMetaTextDetail(metaTextId);

    // State change logging
    usePageLogger('MetaTextDetailPage', {
        watched: [
            ['loading', loading],
            ['metaText', metaText?.id],
            ['errors', errors?.metaText],
        ]
    });


    return (
        <ErrorBoundary>
            <LoadingBoundary loading={loading}>
                <PageContainer>
                    {metaText ? (
                        <Fade in={!loading} timeout={FADE_IN_DURATION}>
                            <Box sx={styles.container}>
                                <MetaTextHeader metaText={metaText} />
                                <Chunks />
                                <ChunkToolsNavbar />
                            </Box>
                        </Fade>
                    ) : null}
                </PageContainer>
            </LoadingBoundary>
        </ErrorBoundary>
    );
}
