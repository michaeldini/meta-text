/**
 * MetatextCreateForm
 * ------------------
 * Presents a small form to create a new Metatext. This file purposefully
 * separates the UI into four tiny, clearly-named presentational subcomponents
 * so the layout & data flow are obvious at a glance:
 *   1. Header            -> <FormHeader />
 *   2. Source Doc Select -> <SourceDocSelect />
 *   3. Title Input       -> <TitleInput />
 *   4. Submit Button     -> <SubmitButton />
 * The container component (<MetatextCreateForm />) owns the hook, data shaping,
 * and passes minimal props to each piece to keep concerns isolated.
 */
import { Icon } from '@components/icons/Icon';
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
interface FormHeaderProps { }
const FormHeader: React.FC<FormHeaderProps> = () => (
    <Box>
        <Heading size="sub" mb={4}>New</Heading>
    </Box>
);

// 2. Source Document Select ----------------------------------------------
interface SourceDocSelectProps {
    // Using 'any' for collection to avoid over‑engineering the generic typing here.
    // If stronger typing is desired, introduce a SourceDocOption type and alias the
    // return type of createListCollection with that generic.
    collection: any;
    onChange: (id: string) => void;
}
const SourceDocSelect: React.FC<SourceDocSelectProps> = ({ collection, onChange }) => (
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
                    {(collection.items as any[]).map((item: any) => (
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

// 3. Title Input ----------------------------------------------------------
interface TitleInputProps {
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}
const TitleInput: React.FC<TitleInputProps> = ({ value, onChange }) => (
    <Input
        placeholder="Title"
        value={value}
        onChange={onChange}
        data-testid="title-input"
        required
    />
);

// 4. Submit Button --------------------------------------------------------
interface SubmitButtonProps {
    loading: boolean;
    disabled: boolean;
}
const SubmitButton: React.FC<SubmitButtonProps> = ({ loading, disabled }) => (
    <Button type="submit" disabled={disabled} data-testid="submit-button" color="primary">
        <Icon name='AISparkle' />
        {loading ? 'Creating...' : 'Create Metatext'}
    </Button>
);

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
            <FormHeader />
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
