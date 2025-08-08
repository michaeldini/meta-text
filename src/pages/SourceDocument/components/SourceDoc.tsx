// Component for displaying and editing source document content
// This component is responsible for rendering the text content of a source document
// with appropriate styles and preferences set by the user. It supports both view and edit modes
// for potentially very long documents (book-length content).
import React from 'react';
import { Box } from '@chakra-ui/react/box';
import { Text } from '@chakra-ui/react';
import { Stack } from '@chakra-ui/react/stack';
import { Prose, Tooltip, Alert } from '@components/ui';
import { HiCheck, HiOutlinePencil, HiXMark } from 'react-icons/hi2';


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
        <Stack direction="row-reverse" data-testid="source-doc-container">
            {/* Error Alert */}
            {error && (
                <Alert status="error">
                    <Text>{error}</Text>
                </Alert>
            )}
            {/* TODO:fix */}
            <Box position="sticky" top="0" width="100%" maxH="80vh" overflowY="auto" zIndex={1}>
                <Editable.Root
                    value={doc.text}
                    onValueChange={(e) => handleTextChange(e.value)}
                    submitMode="blur"
                    activationMode="dblclick"
                    placeholder="Enter document text..."
                    disabled={isSaving}
                    selectOnFocus={false} // Prevents auto-select on focus
                    autoResize={true}
                >
                    <Editable.Preview
                        fontSize={`${textSizePx}px`}
                        fontFamily={fontFamily}
                        lineHeight={lineHeight}
                        aria-label="Document Text"
                        style={{ whiteSpace: 'pre-line', lineHeight: lineHeight }}
                        alignItems="flex-start"
                        width="full"
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
                        overflowY="auto"
                        width="full"
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
        </Stack>
    );
}