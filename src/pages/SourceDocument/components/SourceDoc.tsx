// Component for displaying and editing source document content
// This component is responsible for rendering the text content of a source document
// with appropriate styles and preferences set by the user. It supports both view and edit modes
// for potentially very long documents (book-length content).
import React from 'react';
import { Box } from '@chakra-ui/react/box';
import { Text } from '@chakra-ui/react/typography';
import { IconButton } from '@chakra-ui/react/button';
import { Stack } from '@chakra-ui/react/stack';
import { Textarea } from '@chakra-ui/react/textarea';
import { CloseButton } from '@chakra-ui/react/button';
import { Prose, Tooltip, Alert } from 'components';
import { HiPencil, HiCheck } from 'react-icons/hi2';


// Props for SourceDoc presentational component
import type { SourceDocumentDetail } from 'types';
export interface SourceDocProps {
    doc: SourceDocumentDetail;
    isEditing: boolean;
    editedText: string;
    isSaving: boolean;
    showSuccess: boolean;
    error: string | null;
    textSizePx: number;
    fontFamily: string;
    lineHeight: number;
    handleEdit: () => void;
    handleCancel: () => void;
    handleSave: () => void;
    handleTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}


/**
 * Component for displaying and editing source document content
 * Receives all state and handlers as props from parent
 */
export default function SourceDoc({
    doc,
    isEditing,
    editedText,
    isSaving,
    showSuccess,
    error,
    textSizePx,
    fontFamily,
    lineHeight,
    handleEdit,
    handleCancel,
    handleSave,
    handleTextChange,
}: SourceDocProps) {

    return (
        <Stack direction="row-reverse" data-testid="source-doc-container">
            {/* Edit Controls */}
            <Stack direction="row" >
                {!isEditing ? (
                    <Tooltip content="Edit document text">
                        <IconButton
                            onClick={handleEdit}
                            variant="ghost"
                            color="primary"
                        >
                            <HiPencil />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <>
                        <Tooltip content="Save changes">
                            <IconButton
                                onClick={handleSave}
                                disabled={isSaving}
                                variant="ghost"
                                color="primary"
                            >
                                <HiCheck />
                            </IconButton>
                        </Tooltip>
                        <Tooltip content="Cancel editing">
                            <IconButton
                                onClick={handleCancel}
                                disabled={isSaving}
                                variant="ghost"
                                color="primary"
                            >
                                <CloseButton />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Stack>

            {/* Error Alert */}
            {error && (
                <Alert status="error">
                    <Text>{error}</Text>
                </Alert>
            )}

            {/* Content Display/Editor */}
            {isEditing ? (
                <Box >
                    <Textarea
                        size="xl"
                        value={editedText}
                        onChange={handleTextChange}
                        disabled={isSaving}
                        placeholder="Enter document text..."
                        resize="vertical"
                        style={{ minHeight: '80vh', minWidth: '50vw' }}
                    />
                    {isSaving && (
                        <Box>
                            <Text>Saving...</Text>
                        </Box>
                    )}
                </Box>
            ) : (
                <Prose size="lg"
                    aria-label="Document Text"
                    style={{ whiteSpace: 'pre-line', fontSize: `${textSizePx}px`, lineHeight: lineHeight.toString() + 'em', fontFamily: fontFamily }}
                >
                    {doc.text || 'No content available'}
                </Prose>
            )}
        </Stack>
    );
}