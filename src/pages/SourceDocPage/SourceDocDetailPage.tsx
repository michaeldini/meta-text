import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography, Alert, Button, Slide } from '@mui/material';
import SourceDocInfo from '../../features/sourcedoc/components/SourceDocInfo';
import SourceDoc from '../../features/sourcedoc/components/SourceDoc';
import { useSourceDocumentDetail } from '../../store/sourceDocumentDetailStore';
import log from '../../utils/logger';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingBoundary from '../../components/LoadingBoundary';
import PageContainer from '../../components/PageContainer';
import { usePageLogger } from '../../hooks/usePageLogger';

// Constants
const MESSAGES = {
    NO_DOC_ID: 'No document ID provided.',
    DOC_NOT_FOUND: 'Document not found.',
    RETRY: 'Retry',
    REFRESH: 'Refresh',
} as const;

export default function SourceDocDetailPage() {
    const { sourceDocId } = useParams<{ sourceDocId?: string }>();    // Always call the hook to avoid conditional hook usage
    // The hook handles empty/null IDs gracefully by clearing state
    const { doc, loading, error, refetch } = useSourceDocumentDetail(sourceDocId || '');

    // Memoize error display logic for performance
    const displayError = useMemo(() => {
        return !sourceDocId ? MESSAGES.NO_DOC_ID : error;
    }, [sourceDocId, error]);

    usePageLogger('SourceDocDetailPage', {
        watched: [
            ['loading', loading],
            ['error', error],
            ['doc', doc?.id]
        ]
    });

    useEffect(() => {
        log.info('SourceDocDetailPage mounted');
        return () => log.info('SourceDocDetailPage unmounted');
    }, []);

    return (
        <PageContainer>
            <Slide in={true} direction="up" timeout={{ enter: 500 }}>
                <div>
                    <ErrorBoundary>
                        <LoadingBoundary loading={loading}>
                            {/* Show error if present */}
                            {displayError ? (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {displayError}
                                    {sourceDocId && (
                                        <Button onClick={refetch} size="small" sx={{ ml: 2 }} variant="outlined">
                                            {MESSAGES.RETRY}
                                        </Button>
                                    )}
                                </Alert>
                            ) : doc ? (
                                <>
                                    {/* <Button onClick={refetch}>{MESSAGES.REFRESH}</Button> */}
                                    <SourceDocInfo doc={doc} onInfoUpdate={refetch} />
                                    <SourceDoc doc={doc} />
                                </>
                            ) : (
                                <Alert severity="info">{MESSAGES.DOC_NOT_FOUND}</Alert>
                            )}
                        </LoadingBoundary>
                    </ErrorBoundary>
                </div>
            </Slide>
        </PageContainer>
    );
}
