// Details for a given source document. 
// This includes a header section, meta-data about the document, and the full document content.
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Box, Slide } from '@mui/material';
import type { ReactElement } from 'react';

import { PageContainer, SourceDocInfo, GenerateSourceDocInfoButton, StyleControls, DocumentHeader } from 'components';
import { useSourceDocumentDetail, useUpdateSourceDocument } from 'features';

import SourceDoc from './components/SourceDoc';


function SourceDocDetailPage(): ReactElement {

    // Extract the sourceDocId from the URL parameters
    const { sourceDocId } = useParams<{ sourceDocId?: string }>();

    // Parse the sourceDocId as a number, or null if not present
    const parsedId = sourceDocId ? Number(sourceDocId) : null;

    // Fetch and update using the raw ID; backend will validate and send errors
    const { data: doc, isLoading, error } = useSourceDocumentDetail(parsedId);
    const updateMutation = useUpdateSourceDocument(parsedId);

    const navigate = useNavigate();

    // Redirect if query error (invalid or not found)
    React.useEffect(() => {
        if (error && !isLoading) {
            navigate('/sourcedoc');
        }
    }, [error, isLoading, navigate]);

    return (
        <PageContainer
            loading={isLoading}
            data-testid="sourcedoc-detail-page"
        >
            <Box data-testid="sourcedoc-detail-content" sx={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                {doc && (
                    <>
                        <DocumentHeader title={doc.title}>
                            <GenerateSourceDocInfoButton
                                sourceDocumentId={doc.id}
                            />
                            <StyleControls />
                            <SourceDocInfo doc={doc} onDocumentUpdate={updateMutation.mutate} />
                        </DocumentHeader>
                        <SourceDoc doc={doc} onDocumentUpdate={updateMutation.mutate} />
                    </>
                )}
            </Box>
        </PageContainer>
    );
}

// Export with a more descriptive name for TypeDoc
export { SourceDocDetailPage };

// Default export for React component usage
export default SourceDocDetailPage;
