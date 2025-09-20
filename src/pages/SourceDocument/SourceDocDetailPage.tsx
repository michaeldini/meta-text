/**
* Details for a given source document. 
* This includes a header section, meta-data about the document, and the full document content.
 * */
import React from 'react';

import { Box, Text, Heading } from '@styles';
import type { ReactElement } from 'react';
import { useSourceDocEditor } from './hooks/useSourceDocEditor';

import { useNavigate } from 'react-router-dom';
import { useSourceDocumentDetail, useUpdateSourceDocument } from '@features/documents/useDocumentsData';
import { useUIPreferences } from '@hooks/useUIPreferences';
import SourceDoc from './components/SourceDoc';
import { useValidatedRouteId } from '@hooks/useValidatedRouteId';
import { SourceDocInfoDisplay } from '@components/SourceDocInfo';
import { StyleTools } from '@components/StyleTools';

function headingText(title: string) {
    return <>
        <Heading css={{ fontSize: '2.2rem', fontWeight: 700 }}>{title}</Heading>
        <Heading css={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: 8 }}>
            Edit this document by double-clicking on the text below. To save changes, click the icon. To discard, click outside the text area.
        </Heading>
        <Text css={{ color: '#888', fontSize: '0.95rem' }}>Tip: Scroll after double-clicking to edit.</Text>
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
        <Box data-testid="sourcedoc-detail-page" css={{ maxWidth: '900px', margin: '0 auto' }}>
            <Box>
                {headingText(doc.title)}
                <SourceDocInfoDisplay sourceDocumentId={id} />
                <StyleTools showPaddingX={false} />
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
        </Box>
    );
}

export default SourceDocDetailPage;
