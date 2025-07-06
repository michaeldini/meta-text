import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Button, Slide } from '@mui/material';

import { SourceDocInfo, SourceDoc } from 'features';
import { useSourceDocumentDetailStore } from 'store';
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
    const store = useSourceDocumentDetailStore();
    const { doc, loading, error, refetch } = store;

    // Fetch data when id changes (which is on mount and when the ID changes)
    useEffect(() => {
        if (sourceDocId) {
            store.fetchSourceDocumentDetail(sourceDocId);
        } else {
            store.clearState();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sourceDocId]);

    // If the document ID is not provided, we show a specific error message
    // If an error occurs, we show that instead
    const displayError = !sourceDocId ? MESSAGES.NO_DOC_ID : error;

    usePageLogger('SourceDocDetailPage', {
        watched: [
            ['loading', loading],
            ['error', error],
            ['doc', doc?.id]
        ]
    });
    return (
        <Slide in={true} direction="up" timeout={500}>
            <PageContainer>
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
            </PageContainer>
        </Slide>
    );
}
