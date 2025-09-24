import { HiCheck } from 'react-icons/hi2';
// Component for displaying and editing source document content
// Migrated from Chakra UI to Stitches. Uses primitives and styles from stitches.config.ts via @styles alias.
import React, { useState } from 'react';
import { Box, Text, Button } from '@styles';
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
 * Migrated to Stitches. Editable UX: double-click to edit, click check to save, click outside to cancel.
 */
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
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(doc.text);

    // Sync value if doc.text changes externally
    React.useEffect(() => {
        setValue(doc.text);
    }, [doc.text]);

    const handleEdit = () => {
        if (!isSaving) setIsEditing(true);
    };
    const handleCancel = () => {
        setValue(doc.text);
        setIsEditing(false);
    };
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        handleTextChange(e.target.value);
    };
    const handleSubmit = () => {
        handleSave();
        setIsEditing(false);
    };

    return (
        <Box data-testid="source-doc-container">
            <ErrorAlert message={error} />
            {!isEditing ? (
                <Box
                    css={{
                        fontSize: `${textSizePx}px`,
                        font: fontFamily,
                        lineHeight,
                        whiteSpace: 'pre-line',
                        minHeight: '48px',
                        padding: '1rem',
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                    }}
                    aria-label="Document Text"
                    onDoubleClick={handleEdit}
                    tabIndex={0}
                >
                    <Text>{value || <span style={{ color: '#aaa' }}>Enter document text...</span>}</Text>
                </Box>
            ) : (
                <Box css={{ position: 'relative' }}>
                    <textarea
                        value={value}
                        onChange={handleChange}
                        disabled={isSaving}
                        style={{
                            fontSize: `${textSizePx}px`,
                            fontFamily,
                            lineHeight,
                            whiteSpace: 'pre-line',
                            minHeight: '60vh',
                            width: '100%',
                            padding: '1rem',
                            border: '1px solid $colors$border',
                            borderRadius: 8,
                            background: 'transparent',
                            color: 'inherit',
                            resize: 'vertical',
                            zIndex: 1000,
                        }}
                        aria-label="Edit Document Text"
                        autoFocus
                        onBlur={handleCancel}
                    />
                    <Button
                        tone="primary"
                        css={{ position: 'absolute', top: 12, right: 12, zIndex: 1100 }}
                        onClick={handleSubmit}
                        disabled={isSaving}
                        aria-label="Save"
                    >
                        <HiCheck style={{ fontSize: '1.25em' }} />
                    </Button>
                </Box>
            )}
            {isSaving && (
                <Text css={{ marginTop: '12px', color: '$colors$primary' }}>Saving...</Text>
            )}
        </Box>
    );
}