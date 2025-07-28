
import { Editable } from '@chakra-ui/react/editable';
import { Stack } from '@chakra-ui/react/stack';
import { Text } from '@chakra-ui/react/typography';
import { Collapsible } from '@chakra-ui/react/collapsible';
import { SourceDocumentDetail } from 'types';

interface SourceDocInfoProps {
    doc: SourceDocumentDetail;
    onDocumentUpdate?: (updatedDoc: SourceDocumentDetail) => void;
}


// Configuration for rendering fields in the document info
interface FieldConfig {
    key: keyof import('types').SourceDocumentSummary;
    label: string;
    isListField?: boolean;
}
const FIELD_CONFIG: FieldConfig[] = [
    { key: 'author', label: 'Author' },
    { key: 'summary', label: 'Summary' },
    { key: 'characters', label: 'Characters', isListField: true },
    { key: 'locations', label: 'Locations', isListField: true },
    { key: 'themes', label: 'Themes', isListField: true },
    { key: 'symbols', label: 'Symbols', isListField: true },
];

/**
 * Displays and allows editing of source document metadata fields.
 * Uses Material UI Accordions for each field, with inline editing and save/cancel actions.
 */
export function SourceDocInfo(props: SourceDocInfoProps) {
    const { doc, onDocumentUpdate } = props;

    return (
        <Collapsible.Root data-testid="source-doc-info">
            <Collapsible.Trigger><Text fontWeight="bold">Document Info</Text></Collapsible.Trigger>
            <Collapsible.Content>
                {FIELD_CONFIG.map(config => (
                    <Stack direction="row" key={config.key}>
                        <Text fontWeight="bold">{config.label}</Text>
                        <Editable.Root defaultValue={doc[config.key] != null ? String(doc[config.key]) : 'N/A'}>
                            <Editable.Preview />
                            <Editable.Input />
                        </Editable.Root>
                    </Stack>
                ))}
            </Collapsible.Content>
        </Collapsible.Root>
    );
}

export default SourceDocInfo;
