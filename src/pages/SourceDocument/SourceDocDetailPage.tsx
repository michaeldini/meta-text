// Details for a given source document. 
// This includes a header section, meta-data about the document, and the full document content.

import { useParams } from 'react-router-dom';
import { Box, Slide } from '@mui/material';
import type { ReactElement } from 'react';

import SourceDoc from './components/SourceDoc';
import { PageContainer, SourceDocInfo, AppAlert } from 'components';
import { GenerateSourceDocInfoButton, StyleControls, DocumentHeader } from 'components';
import { FADE_IN_DURATION } from 'constants';
import { useSourceDocumentDetailStore } from 'store';
import { useValidatedIdParam } from 'utils/urlValidation';

import { useSourceDocDetailData } from '../../hooks/useSourceDocDetailData';

function SourceDocDetailPage(): ReactElement {

    const { sourceDocId } = useParams<{ sourceDocId?: string }>();
    const { updateDoc } = useSourceDocumentDetailStore();

    // Validate the sourceDocId parameter using robust validation utility
    const { id: validatedSourceDocId, isValid } = useValidatedIdParam(sourceDocId);

    const {
        doc,
        loading,
        error, // TODO
        refetch // TODO
    } = useSourceDocDetailData(validatedSourceDocId);


    return (
        <PageContainer
            loading={loading}
            data-testid="sourcedoc-detail-page"
        >
            {/* Smooth slide-up animation for the page content */}
            <Slide in={true} direction="up" timeout={FADE_IN_DURATION}>
                <Box data-testid="sourcedoc-detail-content">
                    {doc ? (
                        <>
                            <DocumentHeader title={doc.title}>
                                <GenerateSourceDocInfoButton
                                    sourceDocumentId={doc.id}
                                />
                                <StyleControls />

                                {/* this should prob be passed the source doc instead of fetching it again inside the component. */}
                                <SourceDocInfo doc={doc} onDocumentUpdate={updateDoc} />
                            </DocumentHeader>
                            <SourceDoc doc={doc} onDocumentUpdate={updateDoc} />
                        </>
                    ) : !isValid ? (
                        // Error state when sourceDocId is invalid
                        <AppAlert
                            severity="error"
                        >
                            Invalid source document ID provided.
                        </AppAlert>
                    ) : (
                        // Info state when document is not found (but ID is valid)
                        <AppAlert
                            severity="info"
                        >
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
