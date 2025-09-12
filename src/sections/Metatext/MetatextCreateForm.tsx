import { HiOutlineSparkles } from 'react-icons/hi2';
import React from 'react';
import { Box, Stack, Button, Text, Input, Heading } from '@styles';
import { Select } from '@components/ui/select';
import { useMetatextCreate } from './useMetatextCreate';
import { SourceDocumentSummary } from '@mtypes/documents';

export interface MetatextCreateFormProps {
    sourceDocs: SourceDocumentSummary[];
    sourceDocsLoading: boolean;
}

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
        <Button
            type="submit"
            tone={disabled ? 'disabled' : 'primary'}
            data-testid="submit-button"
            size="md"
            css={{ padding: '8px 12px', borderRadius: 6 }}
        >
            <HiOutlineSparkles style={{ marginRight: 8 }} />
            {loading ? 'Creating...' : 'Create Metatext'}
        </Button>
    );
}


function MetatextCreateForm({ sourceDocs }: MetatextCreateFormProps): React.ReactElement {
    const { title, loading, isSubmitDisabled, handleTitleChange, handleSourceDocChange, handleSubmit, selectedSourceDocId } = useMetatextCreate();

    const sourceDocOptions = React.useMemo(() => sourceDocs.map((doc: SourceDocumentSummary) => ({
        value: String(doc.id),
        label: `${doc.title} ${doc.author ? `by ${doc.author}` : ''}`,
    })), [sourceDocs]);

    // Ensure selectedSourceDocId is always a string
    const selectedSourceDocIdStr = selectedSourceDocId ? String(selectedSourceDocId) : '';

    return (
        <Box>
            <Heading>New</Heading>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <fieldset style={{ border: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                    <SourceDocSelect options={sourceDocOptions} value={selectedSourceDocIdStr} onChange={handleSourceDocChange} />
                    <TitleInput value={title} onChange={handleTitleChange} />
                    <SubmitButton loading={loading} disabled={isSubmitDisabled} />
                </fieldset>
            </form>
        </Box>
    );
}

MetatextCreateForm.displayName = 'MetatextCreateForm';
export default MetatextCreateForm;
