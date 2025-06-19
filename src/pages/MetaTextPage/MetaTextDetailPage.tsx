import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Paper } from '@mui/material';
import SourceDocInfo from '../../features/info/components/SourceDocInfo';
import Chunks from '../../features/chunks';
import { useMetaTextDetail } from '../../store/metaTextDetailStore';
import log from '../../utils/logger';
import { metaTextReviewRoute } from '../../routes';
import PageContainer from '../../components/PageContainer';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingBoundary from '../../components/LoadingBoundary';
import { usePageLogger } from '../../hooks/usePageLogger';
import type { MetaText } from '../../types/metaText';
import type { SourceDocument } from '../../types/sourceDocument';

export default function MetaTextDetailPage() {
    const { metaTextId } = useParams<{ metaTextId: string }>();
    const navigate = useNavigate();
    const {
        metaText,
        loading,
        errors,
        sourceDocInfo,
        refetchSourceDoc,
    } = useMetaTextDetail(metaTextId);

    // Destructure metaText fields early for clarity
    const title = metaText?.title;

    React.useEffect(() => {
        log.info('MetaTextDetailPage mounted');
        return () => log.info('MetaTextDetailPage unmounted');
    }, []);

    // Log lifecycle and state changes
    usePageLogger('MetaTextDetailPage', {
        watched: [
            ['loading', loading],
            ['metaText', metaText?.id],
            ['errors', errors?.metaText],
            ['sourceDocInfo', sourceDocInfo?.id]
        ]
    });

    // If we don't have a metaTextId, that's a routing error
    if (!metaTextId) {
        throw new Error('No MetaText ID provided in URL');
    }

    // If we have a critical MetaText error, show it via error boundary
    if (!loading && errors.metaText) {
        throw new Error(errors.metaText);
    }

    // If there are sourceDoc errors, log them but don't throw (they're not critical for page function)
    if (errors.sourceDoc) {
        log.error('Source document error:', errors.sourceDoc);
    }

    const sourceDocSection = sourceDocInfo ? (
        <SourceDocInfo doc={sourceDocInfo} onInfoUpdate={refetchSourceDoc} />
    ) : null;

    return (
        <ErrorBoundary>
            <LoadingBoundary loading={loading}>
                {metaTextId && metaText ? (
                    <PageContainer>
                        <Paper elevation={3}>
                            <Typography variant="body1">
                                Meta Text Title: {title || metaTextId}
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => navigate(metaTextReviewRoute(metaTextId))}
                            >
                                Review
                            </Button>
                        </Paper>
                        {sourceDocSection}
                        <Chunks metaTextId={metaTextId} />
                    </PageContainer>
                ) : !loading && metaTextId && !errors.metaText ? (
                    <PageContainer>
                        <Typography variant="h6">MetaText not found</Typography>
                        <Typography variant="body2">
                            The MetaText with ID "{metaTextId}" could not be found.
                        </Typography>
                    </PageContainer>
                ) : null}
            </LoadingBoundary>
        </ErrorBoundary>
    );
}
