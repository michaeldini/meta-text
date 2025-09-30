/**
 * Component to display and edit source document metadata fields.
 * Fetches its own data using React Query hooks and manages updates internally.
 * Each field is editable in place, with changes committed on blur.
 * 
 * @module SourceDocInfo
 */
import React from 'react';

/** Import the shared SourceDocSummary type for type safety. */
import { SourceDocumentSummary } from '@mtypes/documents';

/**
 * These imports are for data fetching and mutations.
 * - useSourceDocumentDetail: Fetches source document details by ID.
 * - useUpdateSourceDocument: Mutation hook to update source document details.
 */
import { useSourceDocumentDetail, useUpdateSourceDocument } from '@features/documents/useDocumentsData';

/**
 * Import the hook for generating source document info.
 * - useGenerateSourceDocInfo: Custom hook to handle generating source document info.
 */
import { useGenerateSourceDocInfo } from '@hooks/useGenerateSourceDocInfo';

/** UI Components and Icons */
import { TooltipButton } from '@components/ui/TooltipButton';
import { SimpleDialog } from '@components/ui';
import { Box, Text, Column, Row, Textarea } from '@styles';
import { HiOutlineSparkles } from 'react-icons/hi2';


/**
 * The source document summary fields to display and edit.
 * Each field has a key corresponding to the SourceDocumentSummary type and a label for display.
 */
interface FieldConfig {
    key: keyof SourceDocumentSummary;
    label: string;
}
const FIELD_CONFIG: FieldConfig[] = [
    { key: 'title', label: 'Title' },
    { key: 'author', label: 'Author' },
    { key: 'characters', label: 'Characters' },
    { key: 'locations', label: 'Locations' },
    { key: 'themes', label: 'Themes' },
    { key: 'symbols', label: 'Symbols' },
    { key: 'summary', label: 'Summary' },
];

interface SourceDocInfoProps {
    sourceDocumentId?: number | null;
}

/**
 * Displays and allows editing of source document metadata fields.
 * Fetches its own data using React Query hooks and manages updates internally.
 */
export function SourceDocInfo(sourceDocInfoProps: SourceDocInfoProps) {
    const { sourceDocumentId } = sourceDocInfoProps;

    // Fetch source document data
    const { data: doc, invalidate } = useSourceDocumentDetail(sourceDocumentId);

    // Mutations for updating document
    const updateSourceDocMutation = useUpdateSourceDocument(sourceDocumentId ?? null);

    // Hook for generating source doc info
    const generateSourceDocInfo = useGenerateSourceDocInfo(sourceDocumentId, invalidate);

    // Early return if no data
    if (!doc) {
        return <Text>No source document information available</Text>;
    }

    // Handle value commit for editable fields
    const handleValueCommit = (key: keyof SourceDocumentSummary) => (details: { value: string }) => {
        const updatedDoc = { ...doc, [key]: details.value };
        updateSourceDocMutation.mutate(updatedDoc);
    };

    return (
        <Row>
            <TooltipButton
                label="Generate"
                tooltip="Regenerate document info"
                onClick={generateSourceDocInfo.handleClick}
                disabled={generateSourceDocInfo.loading}
                loading={generateSourceDocInfo.loading}
                icon={<HiOutlineSparkles />}
            />
            <Text>Click on a field to edit. Enter to Save. Tab to Cancel</Text>
            <Column css={{ flex: 1, minWidth: '320px', gap: '2px' }}>
                {FIELD_CONFIG.map(config => (
                    <Box key={config.key} noPad>
                        <Text css={{ fontWeight: 600 }}>{config.label}</Text>
                        <Textarea
                            defaultValue={doc[config.key] != null ? String(doc[config.key]) : 'N/A'}
                            onBlur={e => handleValueCommit(config.key)({ value: e.target.value })}

                        />
                    </Box>
                ))}
            </Column>
        </Row>
    );
}

export function SourceDocInfoDisplay({ sourceDocumentId }: SourceDocInfoProps) {
    return (
        <SimpleDialog
            title="Source Document Info"
            triggerButton={<TooltipButton
                label="Info"
                tooltip="Show Info"
            />}
        >
            <SourceDocInfo sourceDocumentId={sourceDocumentId} />
        </SimpleDialog>
    );
}

export default SourceDocInfoDisplay;