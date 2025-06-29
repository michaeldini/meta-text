import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Fade } from '@mui/material';

import { log } from 'utils';
import { ErrorBoundary, LoadingBoundary } from 'components';
import { usePageLogger } from 'hooks';
import { FloatingChunkToolbar } from 'features/chunk';
import { FADE_IN_DURATION } from 'constants';

import { MetaTextContent, NotFoundDisplay } from './components';
import { useMetaTextDetailPage } from './hooks/useMetaTextDetailPage';
/**
 * MetaTextDetailPage - Main page component
 * Single responsibility: Coordinate page-level concerns (routing, error boundaries, logging)
 */
export default function MetaTextDetailPage() {
    const { metaTextId } = useParams<{ metaTextId: string }>();
    // Add a key to force remount of MetaTextContent (and header) after refresh
    const [contentKey, setContentKey] = useState(0);

    // Extract all business logic to custom hook
    const {
        metaText,
        loading,
        errors,
        sourceDocSection,
        displayTitle,
        handleReviewClick,
        shouldShowContent,
        shouldShowNotFound,
        MESSAGES,
    } = useMetaTextDetailPage(metaTextId);

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
            ['sourceDocSection', sourceDocSection?.doc?.id]
        ]
    });

    // Handler to trigger a full header/content refresh
    const handleHeaderRefresh = () => setContentKey(k => k + 1);

    return (
        <ErrorBoundary>
            <LoadingBoundary loading={loading}>
                {shouldShowContent ? (
                    <Fade in={!loading} timeout={FADE_IN_DURATION}>
                        <Box>
                            <MetaTextContent
                                key={contentKey}
                                metaTextId={metaTextId!}
                                displayTitle={displayTitle}
                                sourceDocSection={sourceDocSection}
                                onReviewClick={handleReviewClick}
                                messages={MESSAGES}
                                onHeaderRefresh={handleHeaderRefresh}
                            />
                            <FloatingChunkToolbar />
                        </Box>
                    </Fade>
                ) : shouldShowNotFound ? (
                    <NotFoundDisplay
                        metaTextId={metaTextId!}
                        messages={MESSAGES}
                    />
                ) : null}
            </LoadingBoundary>
        </ErrorBoundary>
    );
}
