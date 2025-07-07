import { useParams } from 'react-router-dom';
import { Alert, Box, Slide } from '@mui/material';

import { SourceDocInfo, SourceDoc } from 'features';
import { useSourceDocDetailData } from './useSourceDocDetailData';
import { log } from 'utils';
import { PageContainer } from 'components';
import { usePageLogger } from 'hooks';
import { GenerateSourceDocInfoButton, StyleControls, DocumentHeader } from 'components';

export default function SourceDocDetailPage() {
    const { sourceDocId } = useParams<{ sourceDocId?: string }>();
    const { doc, loading, error, refetch } = useSourceDocDetailData(sourceDocId);


    return (
        <PageContainer loading={loading}>
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
    );
}
