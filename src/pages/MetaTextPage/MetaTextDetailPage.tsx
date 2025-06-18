import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Paper } from '@mui/material';
import SourceDocInfo from '../../features/info/components/SourceDocInfo';
import Chunks from '../../features/chunks';
import { useMetaTextDetail } from '../../hooks/useMetaTextDetail';
import { metaTextDetailPaper } from '../../styles/pageStyles';
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

    // Throw error as soon as possible if not loading and no metaText
    if (!loading && !metaText) throw errors.metaText || new Error('MetaText not found');

    // If there are sourceDoc errors, throw them to be caught by ErrorBoundary
    if (errors.sourceDoc) throw errors.sourceDoc;

    const sourceDocSection = sourceDocInfo ? (
        <SourceDocInfo doc={sourceDocInfo} onInfoUpdate={refetchSourceDoc} />
    ) : null;

    return (
        <ErrorBoundary>
            <LoadingBoundary loading={loading}>
                {metaTextId && (
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
                )}
            </LoadingBoundary>
        </ErrorBoundary>
    );
}
