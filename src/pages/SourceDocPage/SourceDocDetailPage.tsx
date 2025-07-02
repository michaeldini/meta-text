import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Button, Slide } from '@mui/material';

import { SourceDocInfo, SourceDoc } from 'features';
import { useSourceDocumentDetail } from 'store';
import { log } from 'utils';
import { ErrorBoundary, LoadingBoundary, PageContainer } from 'components';
import { usePageLogger } from 'hooks';

// Constants
const MESSAGES = {
    NO_DOC_ID: 'No document ID provided.',
    DOC_NOT_FOUND: 'Document not found.',
    RETRY: 'Retry',
} as const;

export default function SourceDocDetailPage() {
    const { sourceDocId } = useParams<{ sourceDocId?: string }>();
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
            <Slide in={true} direction="up" timeout={500}>
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
                                    <SourceDocInfo sourceDocumentId={doc.id} />
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
