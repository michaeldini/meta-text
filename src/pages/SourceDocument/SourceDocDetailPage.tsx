// Details for a given source document. 
// This includes a header section, meta-data about the document, and the full document content.

import { useParams } from 'react-router-dom';
import { Box, Slide } from '@mui/material';
import type { ReactElement } from 'react';

import SourceDoc from './components/SourceDoc';
import { PageContainer, SourceDocInfo, AppAlert } from 'components';
import { GenerateSourceDocInfoButton, StyleControls, DocumentHeader } from 'components';
import { FADE_IN_DURATION } from 'constants';

import { useSourceDocumentDetail, useUpdateSourceDocument } from 'features/documents/useSourceDocumentDetail';
import { useValidatedIdParam } from 'utils/urlValidation';


function SourceDocDetailPage(): ReactElement {

    // Extract the sourceDocId from the URL parameters
    const { sourceDocId } = useParams<{ sourceDocId?: string }>();

    // Validate the sourceDocId parameter using robust validation utility
    const { id: validatedSourceDocId, isValid } = useValidatedIdParam(sourceDocId);

    // Fetch the source document details using the custom hook
    const { data: doc, isLoading: loading, error, refetch } = useSourceDocumentDetail(validatedSourceDocId ?? null);

    // Handle the case where the document is not found or ID is invalid
    const updateMutation = useUpdateSourceDocument(validatedSourceDocId ?? null);

    return (
        <PageContainer
            loading={loading}
            data-testid="sourcedoc-detail-page"
        >
            {/* Smooth slide-up animation for the page content */}
            <Slide in={true} direction="up" timeout={FADE_IN_DURATION}>
                <Box data-testid="sourcedoc-detail-content" sx={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    {doc ? (
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
                    ) : !isValid ? (
                        // Error state when sourceDocId is invalid
                        <AppAlert severity="error">
                            Invalid source document ID provided.
                        </AppAlert>
                    ) : (
                        // Info state when document is not found (but ID is valid)
                        <AppAlert severity="info">
                            Source document not found.
                        </AppAlert>
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
