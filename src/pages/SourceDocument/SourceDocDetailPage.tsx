/**
* Details for a given source document. 
* This includes a header section, meta-data about the document, and the full document content.
 * */
import React from 'react';

import { Box } from '@chakra-ui/react/box';
import { Text } from '@chakra-ui/react/text';
import type { ReactElement } from 'react';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { PageContainer } from '@components/PageContainer';
import { SourceDocInfo } from '@components/SourceDocInfo';
import { StyleControls } from '@components/stylecontrols';
import { DocumentHeader } from '@components/DocumentHeader';
import { TooltipButton } from '@components/TooltipButton';
import { useSourceDocDetail } from './hooks/useSourceDocDetail';
import { useSourceDocEditor } from './hooks/useSourceDocEditor';

import SourceDoc from './components/SourceDoc';
import { Heading } from '@chakra-ui/react/heading';


function SourceDocDetailPage(): ReactElement | null {
    // Use custom hook to handle all page logic
    const {
        doc,
        updateMutation,
        generateSourceDocInfo,
        textSizePx,
        fontFamily,
        lineHeight,
    } = useSourceDocDetail();

    // Use editor hook only if doc is loaded
    const editor = useSourceDocEditor(doc ?? null, updateMutation.mutate);

    if (!doc || !editor) return null;
    return (
        <PageContainer data-testid="sourcedoc-detail-page">
            <Box bg="bg.subtle" p="4" borderRadius="lg" >
                <Heading size="6xl">
                    {doc.title}
                </Heading>
                <SourceDocInfo doc={doc} onDocumentUpdate={updateMutation.mutate} />
                <DocumentHeader title={doc.title}>
                    <TooltipButton
                        label="Generate Info"
                        tooltip="Generate or update document info using AI"
                        onClick={generateSourceDocInfo.handleClick}
                        disabled={generateSourceDocInfo.loading}
                        loading={generateSourceDocInfo.loading}
                        icon={<HiOutlineSparkles />}
                    />
                    <StyleControls mode="sourceDoc" />
                </DocumentHeader>
            </Box>

            {/* TODO: add keyboard shortcut to save ctrl+s */}
            <Heading>Edit this document by double-clicking on the text below. To save changes, click the icon. To discard, click outside the text area.</Heading>
            <Text color="fg.muted">Tip: Scroll after double-clicking to edit.</Text>

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
