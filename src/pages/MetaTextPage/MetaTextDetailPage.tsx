import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, useTheme, Alert, Fade } from '@mui/material';

import { log } from 'utils';
import { ErrorBoundary, LoadingBoundary, PageContainer } from 'components';
import { usePageLogger } from 'hooks';
import { FloatingChunkToolbar } from 'features';
import { Chunks } from 'features';
import { FADE_IN_DURATION } from 'constants';
import { getErrorMessage } from 'types';
import { useMetaTextDetail } from 'store';

import { MetaTextHeader } from './components';
import { getMetaTextPageStyles } from './MetaText.styles';

export default function MetaTextDetailPage() {
    const { metaTextId } = useParams<{ metaTextId: string }>();
    if (!metaTextId || Number.isNaN(Number(metaTextId))) {
        return null;
    }

    const [loadingInfo, setLoadingInfo] = useState(false);
    const [error, setError] = useState('');
    const theme = useTheme();
    const styles = getMetaTextPageStyles(theme);

    // Fetch MetaText detail directly
    const { metaText, loading, errors } = useMetaTextDetail(metaTextId);

    // Lifecycle logging
    useEffect(() => {
        log.info('MetaTextDetailPage mounted');
        return () => log.info('MetaTextDetailPage unmounted');
    }, []);

    // State change logging
    usePageLogger('MetaTextDetailPage', {
        watched: [
            ['loading', loading],
            ['metaText', metaText?.id],
            ['errors', errors?.metaText],
        ]
    });

    // Messages required by MetaTextHeader
    const MESSAGES = {
        META_TEXT_TITLE: 'Meta Text Title:',
        REVIEW_BUTTON: 'Review',
    };

    // // Download info handler (if/when sourceDocSection is used)
    // const handleDownloadInfo = async (sourceDocSection: { doc: any; onInfoUpdate: () => void } | null) => {
    //     setLoadingInfo(true);
    //     setError('');
    //     try {
    //         const prompt = sourceDocSection?.doc.text || '';
    //         if (!sourceDocSection?.doc.id || !prompt) {
    //             throw new Error('Document ID or text is missing.');
    //         }
    //         await generateSourceDocInfo({ id: sourceDocSection.doc.id, prompt });
    //         if (sourceDocSection.onInfoUpdate) sourceDocSection.onInfoUpdate();
    //     } catch (err: unknown) {
    //         setError(getErrorMessage(err, 'Failed to generate info'));
    //     } finally {
    //         setLoadingInfo(false);
    //     }
    // };

    return (
        <ErrorBoundary>
            <LoadingBoundary loading={loading}>
                {metaText ? (
                    <Fade in={!loading} timeout={FADE_IN_DURATION}>
                        <Box>
                            <PageContainer>
                                <Box sx={styles.container}>
                                    <MetaTextHeader metaText={metaText} />
                                    <Chunks metaTextId={metaTextId.toString()} />
                                    {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
                                </Box>
                            </PageContainer>
                            <FloatingChunkToolbar />
                        </Box>
                    </Fade>
                ) : null}
            </LoadingBoundary>
        </ErrorBoundary>
    );
}
