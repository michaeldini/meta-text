import { Editable } from '@chakra-ui/react/editable';
import { Stack } from '@chakra-ui/react/stack';
import { Text } from '@chakra-ui/react/text';
import { SourceDocumentDetail, SourceDocumentSummary } from '@mtypes/documents';

import { HiOutlineSparkles } from 'react-icons/hi2';
import { TooltipButton } from '@components/TooltipButton';
import { Box } from '@chakra-ui/react/box';

interface SourceDocInfoProps {
    doc: SourceDocumentDetail;
    onDocumentUpdate?: (updatedDoc: SourceDocumentDetail) => void;
    generateSourceDocInfo?: {
        handleClick: () => void;
        loading: boolean;
    };
}


// Configuration for rendering fields in the document info
interface FieldConfig {
    key: keyof SourceDocumentSummary;
    label: string;
    isListField?: boolean;
}
const FIELD_CONFIG: FieldConfig[] = [
    { key: 'author', label: 'Author' },
    { key: 'summary', label: 'Summary' },
    { key: 'characters', label: 'Characters', isListField: true }, // TODO Remove isListField if not needed
    { key: 'locations', label: 'Locations', isListField: true },
    { key: 'themes', label: 'Themes', isListField: true },
    { key: 'symbols', label: 'Symbols', isListField: true },
];

/**
 * Displays and allows editing of source document metadata fields.
 * Uses Material UI Accordions for each field, with inline editing and save/cancel actions.
 */
export function SourceDocInfo(props: SourceDocInfoProps) {
    const { doc, onDocumentUpdate, generateSourceDocInfo } = props;

    // Handle value commit for editable fields
    const handleValueCommit = (key: keyof SourceDocumentSummary) => (details: { value: string }) => {
        const updatedDoc = { ...doc, [key]: details.value };
        if (onDocumentUpdate) {
            onDocumentUpdate(updatedDoc);
        }
    };

    return (
        <Box>
            {generateSourceDocInfo && (
                <TooltipButton
                    label="Generate"
                    tooltip="Regenerate document info"
                    onClick={generateSourceDocInfo.handleClick}
                    disabled={generateSourceDocInfo.loading}
                    loading={generateSourceDocInfo.loading}
                    icon={<HiOutlineSparkles />}
                />
            )}
            <Text color="fg.muted" mb="4">Click on a field to edit. Enter to Save. Tab to Cancel</Text>
            {FIELD_CONFIG.map(config => (
                <Stack direction="row" key={config.key} align="center">
                    <Text fontWeight="bold" minWidth="6rem">{config.label}</Text>
                    <Editable.Root
                        defaultValue={doc[config.key] != null ? String(doc[config.key]) : 'N/A'}
                        submitMode={"enter"}
                        onValueCommit={handleValueCommit(config.key)}>
                        <Editable.Preview />
                        <Editable.Input />
                    </Editable.Root>
                </Stack>
            ))}
        </Box>
    );
}

export default SourceDocInfo;
