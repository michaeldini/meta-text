import { HiOutlineSparkles } from 'react-icons/hi2';
import React from 'react';
import { Box, IconWrapper, Button, Input, Heading } from '@styles';
import { Select, TooltipButton } from '@components/ui';
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
        <TooltipButton
            label="Create Metatext"
            tooltip={disabled ? 'Please fill in all required fields' : 'Submit to create metatext'}
            disabled={disabled}
            loading={loading}
            icon={<HiOutlineSparkles style={{ marginRight: 8 }} />}
            type="submit"
            // tone={disabled ? 'disabled' : 'primary'}
            data-testid="submit-button"
        />
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
        <Box variant="homepageSection">
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
