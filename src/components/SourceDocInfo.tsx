import React from 'react';
import { Box, Text, Stack, Flex, Textarea } from '@styles';
import { Input } from '@styles';
import { SimpleDialog } from '@components/ui';

import { HiOutlineSparkles } from 'react-icons/hi2';

import { SourceDocumentSummary } from '@mtypes/documents';
import { TooltipButton } from '@components/ui/TooltipButton';


import { useSourceDocumentDetail, useUpdateSourceDocument } from '@features/documents/useDocumentsData';
import { useGenerateSourceDocInfo } from '@hooks/useGenerateSourceDocInfo';

interface SourceDocInfoProps {
    sourceDocumentId?: number | null;
}


// Configuration for rendering fields in the document info
interface FieldConfig {
    key: keyof SourceDocumentSummary;
    label: string;
    isListField?: boolean;
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

/**
 * Displays and allows editing of source document metadata fields.
 * Fetches its own data using React Query hooks and manages updates internally.
 */
export function SourceDocInfo(props: SourceDocInfoProps) {
    const { sourceDocumentId } = props;

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
        <Flex>
            <TooltipButton
                label="Generate"
                tooltip="Regenerate document info"
                onClick={generateSourceDocInfo.handleClick}
                disabled={generateSourceDocInfo.loading}
                loading={generateSourceDocInfo.loading}
                icon={<HiOutlineSparkles />}
            />
            <Text>Click on a field to edit. Enter to Save. Tab to Cancel</Text>
            <Stack css={{ flex: 1, minWidth: '320px', gap: '2px' }}>
                {FIELD_CONFIG.map(config => (
                    <Box key={config.key} noPad>
                        <Text css={{ fontWeight: 600 }}>{config.label}</Text>
                        <Textarea
                            defaultValue={doc[config.key] != null ? String(doc[config.key]) : 'N/A'}
                            onBlur={e => handleValueCommit(config.key)({ value: e.target.value })}

                        />
                    </Box>
                ))}
            </Stack>
        </Flex>
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