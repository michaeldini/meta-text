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

import { useNavigate } from 'react-router-dom';
import { useSourceDocumentDetail, useUpdateSourceDocument } from '@features/documents/useDocumentsData';
import { useUIPreferences } from '@hooks/useUIPreferences';
import SourceDoc from './components/SourceDoc';
import { Heading } from '@chakra-ui/react/heading';
import { useValidatedRouteId } from '@hooks/useValidatedRouteId';
import { Tabs } from '@chakra-ui/react/tabs';

function SourceDocDetailPage(): ReactElement | null {
    // Route param -> validated numeric id (redirects if invalid)
    const id = useValidatedRouteId('sourceDocId');
    // react-query functions
    // Fetch and update using the raw ID; backend will validate and send errors
    const { data: doc, isLoading, error, refetch } = useSourceDocumentDetail(id);
    const updateMutation = useUpdateSourceDocument(id);
    const { textSizePx, fontFamily, lineHeight } = useUIPreferences();

    // Use editor hook only if doc is loaded
    const editor = useSourceDocEditor(doc ?? null, updateMutation.mutate);

    // Redirect if query error (invalid or not found)
    const navigate = useNavigate();

    if (id === null) return null;

    React.useEffect(() => {
        if (error && !isLoading) {
            navigate('/');
        }
    }, [error, isLoading, navigate]);

    if (!doc || !editor) return null;
    return (
        <PageContainer data-testid="sourcedoc-detail-page">
            <Box bg="bg.subtle" p="4" borderRadius="lg" mb="10">
                <Heading size="6xl">
                    {doc.title}
                </Heading>
                <Tabs.Root w="100%" deselectable fitted defaultValue={"Controls"}>
                    <Tabs.List colorPalette="blue">
                        <Tabs.Trigger value="info">Info</Tabs.Trigger>
                        <Tabs.Trigger value="styles">Styles</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="info">
                        <SourceDocInfo sourceDocumentId={id} />
                    </Tabs.Content>
                    <Tabs.Content value="styles">
                        <StyleControls showPaddingX={false} />
                    </Tabs.Content>
                </Tabs.Root>
                {/* Document Header */}
                {/* <DocumentHeader title={doc.title}>
                    <Text>{doc.title}</Text>
                </DocumentHeader> */}
            </Box>
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
