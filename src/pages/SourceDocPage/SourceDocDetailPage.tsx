import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Box, Slide } from '@mui/material';

import { SourceDocInfo, SourceDoc } from 'features';
import { useSourceDocumentDetailStore } from 'store';
import { log } from 'utils';
import { ErrorBoundary, LoadingBoundary, PageContainer } from 'components';
import { usePageLogger } from 'hooks';
import { GenerateSourceDocInfoButton, StyleControls, DocumentHeader } from 'components';

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

    usePageLogger('SourceDocDetailPage', {
        watched: [
            ['loading', loading],
            ['error', error],
            ['doc', doc?.id]
        ]
    });
    return (
        <ErrorBoundary>
            <LoadingBoundary loading={loading}>
                <PageContainer>
                    <Slide in={true} direction="up" timeout={500}>
                        <Box>
                            {doc ? (
                                <>
                                    <DocumentHeader title={doc.title}>
                                        <GenerateSourceDocInfoButton
                                            sourceDocumentId={doc.id}
                                        />
                                        <StyleControls />
                                        <SourceDocInfo sourceDocumentId={doc.id} />
                                    </DocumentHeader>
                                    <SourceDoc doc={doc} />
                                </>
                            ) : (
                                <Alert severity="info">Document not found.</Alert>
                            )}
                        </Box>

                    </Slide>
                </PageContainer>
            </LoadingBoundary>
        </ErrorBoundary>
    );
}
