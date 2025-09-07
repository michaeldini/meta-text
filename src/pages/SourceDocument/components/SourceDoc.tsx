import { HiCheck } from 'react-icons/hi2';
// Component for displaying and editing source document content
// This component is responsible for rendering the text content of a source document
// with appropriate styles and preferences set by the user. It supports both view and edit modes
// for potentially very long documents (book-length content).
import React from 'react';
import { Box } from '@chakra-ui/react/box';
import { Text } from '@chakra-ui/react';
import { ErrorAlert } from '@components/ErrorAlert';


// Props for SourceDoc presentational component
import type { SourceDocumentDetail } from '@mtypes/documents';
export interface SourceDocProps {
    doc: SourceDocumentDetail;
    isSaving: boolean;
    error: string | null;
    textSizePx: number;
    fontFamily: string;
    lineHeight: number;
    handleSave: () => void;
    handleTextChange: (value: string) => void;
}


/**
 * Component for displaying and editing source document content
 * Receives all state and handlers as props from parent
 */
// Refactored for Chakra UI Editable integration
import { Editable } from '@chakra-ui/react';

export default function SourceDoc({
    doc,
    isSaving,
    error,
    textSizePx,
    fontFamily,
    lineHeight,
    handleSave,
    handleTextChange,
}: SourceDocProps) {
    return (
        <Box
            data-testid="source-doc-container">
            <ErrorAlert message={error} />
            <Box width="100%" zIndex={1}>
                <Editable.Root
                    value={doc.text}
                    onValueChange={(e) => handleTextChange(e.value)}
                    submitMode="blur"
                    activationMode="dblclick"
                    placeholder="Enter document text..."
                    disabled={isSaving}
                    selectOnFocus={false} // Prevents auto-select on focus

                >
                    <Editable.Preview
                        fontSize={`${textSizePx}px`}
                        fontFamily={fontFamily}
                        lineHeight={lineHeight}
                        aria-label="Document Text"
                        style={{ whiteSpace: 'pre-line', lineHeight: lineHeight }}
                        alignItems="flex-start"
                        p="1rem"
                    />
                    <Editable.Textarea
                        fontSize={`${textSizePx}px`}
                        fontFamily={fontFamily}
                        lineHeight={lineHeight}
                        disabled={isSaving}
                        style={{ whiteSpace: 'pre-line', lineHeight: lineHeight }}
                        minHeight="80vh"
                        zIndex={1000}
                        padding="1rem"

                    />
                    <Editable.Control>
                        <Editable.SubmitTrigger asChild>
                            <HiCheck style={{ fontSize: '1.25em', cursor: 'pointer' }} onClick={handleSave} />
                        </Editable.SubmitTrigger >
                    </Editable.Control>
                    {isSaving && (
                        <Box>
                            <Text>Saving...</Text>
                        </Box>
                    )}
                </Editable.Root>
            </Box>
        </Box>
    );
}