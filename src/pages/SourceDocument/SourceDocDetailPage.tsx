/**
* Details for a given source document. 
* This includes a header section, meta-data about the document, and the full document content.
 * */
import React from 'react';

import { Box } from '@chakra-ui/react/box';
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
import { Stack } from '@chakra-ui/react/stack';


function SourceDocDetailPage(): ReactElement {
    // Use custom hook to handle all page logic
    const {
        doc,
        isLoading,
        error,
        updateMutation,
        generateSourceDocInfo,
        textSizePx,
        fontFamily,
        lineHeight,
    } = useSourceDocDetail();

    // Use editor hook only if doc is loaded
    const editor = useSourceDocEditor(doc ?? null, updateMutation.mutate);

    return (
        <PageContainer
            loading={isLoading}
            data-testid="sourcedoc-detail-page"
        >
            <Box data-testid="sourcedoc-detail-content">
                {doc && editor && (
                    <Stack gap="2" pt="2">

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
                            <StyleControls />
                        </DocumentHeader>
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
                    </Stack>
                )}
            </Box>
        </PageContainer>
    );
}

// Export with a more descriptive name for TypeDoc
export { SourceDocDetailPage };

// Default export for React component usage
export default SourceDocDetailPage;
