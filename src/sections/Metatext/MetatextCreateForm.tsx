import { HiOutlineSparkles } from 'react-icons/hi2';
import React from 'react';
import { Box, Heading, Button, Input } from '@chakra-ui/react';
import { Fieldset } from '@chakra-ui/react';
import { Select } from '@components/ui/select';
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
    options: { label: string; value: string }[];
    value: string;
    onChange: (id: string) => void;
}
function SourceDocSelect({ options, value, onChange }: SourceDocSelectProps) {
    return (
        <Select
            options={options}
            value={value}
            onChange={onChange}
            placeholder="Select a source document"
            label="Source Document"
            width="100%"
        />
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
        <Button type="submit" disabled={disabled} data-testid="submit-button" colorScheme="primary">
            <HiOutlineSparkles style={{ marginRight: 8 }} />
            {loading ? 'Creating...' : 'Create Metatext'}
        </Button>
    );
}

// Container / Composition -------------------------------------------------
function MetatextCreateForm({ sourceDocs }: MetatextCreateFormProps): React.ReactElement {
    const { title, loading, isSubmitDisabled, handleTitleChange, handleSourceDocChange, handleSubmit, selectedSourceDocId } = useMetatextCreate();

    const sourceDocOptions = React.useMemo(() => sourceDocs.map(doc => ({
        value: String(doc.id),
        label: `${doc.title} ${doc.author ? `by ${doc.author}` : ''}`,
    })), [sourceDocs]);

    // Ensure selectedSourceDocId is always a string
    const selectedSourceDocIdStr = selectedSourceDocId ? String(selectedSourceDocId) : '';

    return (
        <Box p={2} borderWidth={"4px"} borderColor="border.muted" borderRadius="lg" shadow="md" minWidth="xs">
            {header}
            <form onSubmit={handleSubmit}>
                <Fieldset.Root>
                    <SourceDocSelect options={sourceDocOptions} value={selectedSourceDocIdStr} onChange={handleSourceDocChange} />
                    <TitleInput value={title} onChange={handleTitleChange} />
                    <SubmitButton loading={loading} disabled={isSubmitDisabled} />
                </Fieldset.Root>
            </form>
        </Box>
    );
}

MetatextCreateForm.displayName = 'MetatextCreateForm';
export default MetatextCreateForm;
