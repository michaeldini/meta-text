import React from 'react';
import { Box, Text, Stack, Flex } from '@styles';
import { styled } from '@styles';
import { SimpleDrawer } from '@components/ui';

import { HiOutlineSparkles } from 'react-icons/hi2';

import { SourceDocumentSummary } from '@mtypes/documents';
import { TooltipButton } from '@components/TooltipButton';


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
        return <Text css={{ color: '$gray500' }}>No source document information available</Text>;
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
            <Text css={{ width: '100%', color: '$gray500', marginBottom: 16 }}>Click on a field to edit. Enter to Save. Tab to Cancel</Text>
            <Stack css={{ padding: 8, gap: 12 }}>
                {FIELD_CONFIG.map(config => (
                    <Box key={config.key}>
                        <Text css={{ fontWeight: 600 }}>{config.label}</Text>
                        {/* Editable field migration: replace with a simple input for now */}
                        <input
                            defaultValue={doc[config.key] != null ? String(doc[config.key]) : 'N/A'}
                            onBlur={e => handleValueCommit(config.key)({ value: e.target.value })}
                            style={{ minHeight: 48, width: '100%', fontSize: '1rem', padding: 6, border: '1px solid #ccc', borderRadius: 6 }}
                        />
                    </Box>
                ))}
            </Stack>
        </Flex>
    );
}



export function SourceDocInfoDisplay({ sourceDocumentId }: SourceDocInfoProps) {
    return (
        <SimpleDrawer
            title="Source Document Info"
            triggerButton={<TooltipButton
                label="Info"
                tooltip="Show Info"
            />}
        >
            <SourceDocInfo sourceDocumentId={sourceDocumentId} />
        </SimpleDrawer>
    );
}

export default SourceDocInfoDisplay;