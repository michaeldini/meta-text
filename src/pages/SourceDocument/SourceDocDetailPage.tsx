// Details for a given source document. 
// This includes a header section, meta-data about the document, and the full document content.

import { useParams } from 'react-router-dom';
import { Alert, Box, Slide } from '@mui/material';
import type { ReactElement } from 'react';

import SourceDoc from './components/SourceDoc';
import { PageContainer, SourceDocInfo } from 'components';
import { GenerateSourceDocInfoButton, StyleControls, DocumentHeader } from 'components';

import { useSourceDocDetailData } from '../../hooks/useSourceDocDetailData';

function SourceDocDetailPage(): ReactElement {

    const { sourceDocId } = useParams<{ sourceDocId?: string }>();


    const {
        doc,
        loading,
        error, // TODO
        refetch // TODO
    } = useSourceDocDetailData(sourceDocId);


    return (
        <PageContainer
            loading={loading}
            data-testid="sourcedoc-detail-page"
        >
            {/* Smooth slide-up animation for the page content */}
            <Slide in={true} direction="up" timeout={500}>
                <Box data-testid="sourcedoc-detail-content">
                    {doc ? (
                        <>
                            <DocumentHeader title={doc.title}>
                                <GenerateSourceDocInfoButton
                                    sourceDocumentId={doc.id}
                                />
                                <StyleControls />

                                {/* this should prob be passed the source doc instead of fetching it again inside the component. */}
                                <SourceDocInfo doc={doc}
                                />
                            </DocumentHeader>
                            <SourceDoc doc={doc} />
                        </>
                    ) : (
                        // Error state when document is not found
                        <Alert
                            severity="info"
                            data-testid="sourcedoc-not-found"
                        >
                            Document not found.
                        </Alert>
                    )}
                </Box>
            </Slide>
        </PageContainer>
    );
}

// Export with a more descriptive name for TypeDoc
export { SourceDocDetailPage };

// Default export for React component usage
export default SourceDocDetailPage;
