/**
* Details for a given source document. 
* This includes a header section, meta-data about the document, and the full document content.
 * */
import React from 'react';

import { Box } from '@chakra-ui/react/box';
import { Text } from '@chakra-ui/react/text';
import type { ReactElement } from 'react';
import { PageContainer } from '@components/PageContainer';
import { SourceDocInfo } from '@components/SourceDocInfo';
import { StyleControls } from '@components/stylecontrols';
import { DocumentHeader } from '@components/DocumentHeader';
// import { useSourceDocDetail } from './hooks/useSourceDocDetail';
import { useSourceDocEditor } from './hooks/useSourceDocEditor';

import { useNavigate, useParams } from 'react-router-dom';
import { useSourceDocumentDetail, useUpdateSourceDocument } from '@features/documents/useDocumentsData';
import { useGenerateSourceDocInfo } from '@hooks/useGenerateSourceDocInfo';
import { useUIPreferences } from '@hooks/useUIPreferences';
import SourceDoc from './components/SourceDoc';
import { Heading } from '@chakra-ui/react/heading';

function SourceDocDetailPage(): ReactElement | null {
    // Use custom hook to handle all page logic
    // Extract the sourceDocId from the URL parameters
    const { sourceDocId } = useParams<{ sourceDocId?: string }>();
    const parsedId = sourceDocId ? Number(sourceDocId) : null;

    // react-query functions
    // Fetch and update using the raw ID; backend will validate and send errors
    const { data: doc, isLoading, error, refetch } = useSourceDocumentDetail(parsedId);
    const updateMutation = useUpdateSourceDocument(parsedId);
    const generateSourceDocInfo = useGenerateSourceDocInfo(doc?.id ?? 0, refetch);
    const { textSizePx, fontFamily, lineHeight } = useUIPreferences();


    // Redirect if query error (invalid or not found)
    const navigate = useNavigate();
    React.useEffect(() => {
        if (error && !isLoading) {
            navigate('/');
        }
    }, [error, isLoading, navigate]);


    // Use editor hook only if doc is loaded
    const editor = useSourceDocEditor(doc ?? null, updateMutation.mutate);

    if (!doc || !editor) return null;
    return (
        <PageContainer data-testid="sourcedoc-detail-page">

            {/* Document Header */}
            <Box bg="bg.subtle" p="4" borderRadius="lg" mb="10">
                <Heading size="6xl">
                    {doc.title}
                </Heading>
                <SourceDocInfo
                    doc={doc}
                    onDocumentUpdate={updateMutation.mutate}
                    generateSourceDocInfo={generateSourceDocInfo} />
                <DocumentHeader title={doc.title}>
                    <StyleControls
                        showPaddingX={false}
                    />
                </DocumentHeader>
            </Box>


            {/* TODO: add keyboard shortcut to save ctrl+s */}
            <Heading>Edit this document by double-clicking on the text below. To save changes, click the icon. To discard, click outside the text area.</Heading>
            <Text color="fg.muted" pb="10">Tip: Scroll after double-clicking to edit.</Text>
            <SourceDoc
                doc={doc}
                isSaving={editor.isSaving}
                error={editor.error}
                textSizePx={textSizePx}
                fontFamily={fontFamily}
                lineHeight={lineHeight}
                handleSave={editor.handleSave}
                handleTextChange={editor.handleTextChange}
            />
        </PageContainer>

    );
}

export default SourceDocDetailPage;
