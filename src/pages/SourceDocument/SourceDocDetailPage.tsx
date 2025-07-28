/**
* Details for a given source document. 
* This includes a header section, meta-data about the document, and the full document content.
 * */
import React from 'react';

import { Box } from '@chakra-ui/react/box';
import type { ReactElement } from 'react';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { PageContainer, SourceDocInfo, StyleControls, DocumentHeader, TooltipButton } from 'components';
import { useSourceDocDetail } from './hooks/useSourceDocDetail';

import SourceDoc from './components/SourceDoc';


function SourceDocDetailPage(): ReactElement {

    // Use custom hook to handle all page logic
    const { doc, isLoading, error, updateMutation, generateSourceDocInfo } = useSourceDocDetail();

    return (
        <PageContainer
            loading={isLoading}
            data-testid="sourcedoc-detail-page"
        >
            <Box data-testid="sourcedoc-detail-content">
                {doc && (
                    <>
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
