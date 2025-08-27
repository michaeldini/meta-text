import { HiOutlineSparkles } from 'react-icons/hi2';
import React from 'react';
import { Box } from '@chakra-ui/react/box';
import { Heading, createListCollection } from '@chakra-ui/react';
import { Select } from '@chakra-ui/react/select';
import { Portal } from '@chakra-ui/react/portal';
import { Button } from '@chakra-ui/react/button';
import { Input } from '@chakra-ui/react/input';
import { Fieldset } from '@chakra-ui/react/fieldset';
import { useMetatextCreate } from './useMetatextCreate';
import { SourceDocumentSummary } from '@mtypes/documents';

export interface MetatextCreateFormProps {
    sourceDocs: SourceDocumentSummary[];
    sourceDocsLoading: boolean;
}

// 1. Header ---------------------------------------------------------------
const header = (
    <Box>
        <Heading size="sub" mb={4}>New</Heading>
    </Box>
);

// 2. Source Document Select ----------------------------------------------
interface SourceDocSelectProps {
    // eslint-disable-next-line
    collection: any;
    onChange: (id: string) => void;
}
function SourceDocSelect({ collection, onChange }: SourceDocSelectProps) {
    return (
        <Select.Root collection={collection} onValueChange={(e) => onChange(e.value[0])}>
            <Select.HiddenSelect />
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Select a source document" color="fg.muted" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {/* eslint-disable-next-line  */}
                        {(collection.items).map((item: any) => (
                            <Select.Item item={item} key={item.value}>
                                {item.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
}

// 3. Title Input ----------------------------------------------------------
interface TitleInputProps {
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}
function TitleInput({ value, onChange }: TitleInputProps) {
    return (
        <Input
            placeholder="Title"
            value={value}
            onChange={onChange}
            data-testid="title-input"
            required
        />
    );
}

// 4. Submit Button --------------------------------------------------------
interface SubmitButtonProps {
    loading: boolean;
    disabled: boolean;
}
function SubmitButton({ loading, disabled }: SubmitButtonProps) {
    return (
        <Button type="submit" disabled={disabled} data-testid="submit-button" color="primary">
            <HiOutlineSparkles />
            {loading ? 'Creating...' : 'Create Metatext'}
        </Button>
    );
}

// Container / Composition -------------------------------------------------
function MetatextCreateForm({ sourceDocs }: MetatextCreateFormProps): React.ReactElement {
    const { title, loading, isSubmitDisabled, handleTitleChange, handleSourceDocChange, handleSubmit } = useMetatextCreate();

    // Shape the select options once per render of the container.
    const sourceDocOptions = React.useMemo(() => createListCollection({
        items: sourceDocs.map(doc => ({
            value: doc.id,
            label: `${doc.title} ${doc.author ? `by ${doc.author}` : ''}`,
        }))
    }), [sourceDocs]);

    return (
        <Box p="2" borderWidth="4px" borderColor="border.muted" borderRadius="lg" dropShadow="md">
            {header}
            <form onSubmit={handleSubmit}>
                <Fieldset.Root>
                    <SourceDocSelect collection={sourceDocOptions} onChange={handleSourceDocChange} />
                    <TitleInput value={title} onChange={handleTitleChange} />
                    <SubmitButton loading={loading} disabled={isSubmitDisabled} />
                </Fieldset.Root>
            </form>
        </Box>
    );
}

MetatextCreateForm.displayName = 'MetatextCreateForm';
export default MetatextCreateForm;
