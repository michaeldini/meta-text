/**
* Details for a given source document. 
* This includes a header section, meta-data about the document, and the full document content.
 * */
import React from 'react';

import { Box } from '@chakra-ui/react/box';
import { Text } from '@chakra-ui/react/text';
import type { ReactElement } from 'react';
import { useSourceDocEditor } from './hooks/useSourceDocEditor';

import { useNavigate } from 'react-router-dom';
import { useSourceDocumentDetail, useUpdateSourceDocument } from '@features/documents/useDocumentsData';
import { useUIPreferences } from '@hooks/useUIPreferences';
import SourceDoc from './components/SourceDoc';
import { Heading } from '@chakra-ui/react/heading';
import { useValidatedRouteId } from '@hooks/useValidatedRouteId';
import { SourceDocInfoDisplay } from '@components/SourceDocInfo';
import { StyleControls } from '@components/stylecontrols';
import { Container } from '@chakra-ui/react/container';

function headingText(title: string) {
    return <>
        <Heading size="6xl">{title}</Heading>
        <Heading size="md">Edit this document by double-clicking on the text below. To save changes, click the icon. To discard, click outside the text area.</Heading>
        <Text color="fg.muted">Tip: Scroll after double-clicking to edit.</Text>
    </>
}
function SourceDocDetailPage(): ReactElement | null {
    // Route param -> validated numeric id (redirects if invalid)
    const id = useValidatedRouteId('sourceDocId');
    // react-query functions
    // Fetch and update using the raw ID; backend will validate and send errors
    const { data: doc, isLoading, error } = useSourceDocumentDetail(id);
    const updateMutation = useUpdateSourceDocument(id);
    const { textSizePx, fontFamily, lineHeight } = useUIPreferences();

    // Use editor hook only if doc is loaded
    const editor = useSourceDocEditor(doc ?? null, updateMutation.mutate);

    // Redirect if query error (invalid or not found)
    const navigate = useNavigate();
    React.useEffect(() => {
        if (error && !isLoading) {
            navigate('/');
        }
    }, [error, isLoading, navigate]);

    if (id === null) return null;
    if (!doc || !editor) return null;
    return (
        <Container maxWidth="4xl" data-testid="sourcedoc-detail-page">
            <Box bg="bg.subtle" p="4" mb="10">
                {headingText(doc.title)}
                <SourceDocInfoDisplay sourceDocumentId={id} />
                <StyleControls showPaddingX={false} />
            </Box>
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
        </Container>

    );
}

export default SourceDocDetailPage;
