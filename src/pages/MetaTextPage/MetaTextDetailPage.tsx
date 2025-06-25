import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Slide } from '@mui/material';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingBoundary from '../../components/LoadingBoundary';
import { usePageLogger } from '../../hooks/usePageLogger';
import { useMetaTextDetailPage } from './hooks/useMetaTextDetailPage';
import { MetaTextContent, NotFoundDisplay } from './components';
import log from '../../utils/logger';
import FloatingChunkToolbar from '../../features/chunks/layouts/toolbars/FloatingChunkToolbar';

/**
 * MetaTextDetailPage - Main page component
 * Single responsibility: Coordinate page-level concerns (routing, error boundaries, logging)
 */
export default function MetaTextDetailPage() {
    const { metaTextId } = useParams<{ metaTextId: string }>();

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

    return (
        <ErrorBoundary>
            <Slide in={true} timeout={500} direction="up">
                <div>
                    <LoadingBoundary loading={loading}>
                        {shouldShowContent ? (
                            <MetaTextContent
                                metaTextId={metaTextId!}
                                displayTitle={displayTitle}
                                sourceDocSection={sourceDocSection}
                                onReviewClick={handleReviewClick}
                                messages={MESSAGES}
                            />
                        ) : shouldShowNotFound ? (
                            <NotFoundDisplay
                                metaTextId={metaTextId!}
                                messages={MESSAGES}
                            />
                        ) : null}
                    </LoadingBoundary>
                </div>
            </Slide>
            <FloatingChunkToolbar />
        </ErrorBoundary>
    );
}
