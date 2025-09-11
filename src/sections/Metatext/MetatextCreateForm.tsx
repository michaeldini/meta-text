import { HiOutlineSparkles } from 'react-icons/hi2';
import React from 'react';
import { styled, css, Button, Text } from '@styles';
import { Select } from '@components/ui/select';
import { useMetatextCreate } from './useMetatextCreate';
import { SourceDocumentSummary } from '@mtypes/documents';

export interface MetatextCreateFormProps {
    sourceDocs: SourceDocumentSummary[];
    sourceDocsLoading: boolean;
}

// 1. Stitches primitives --------------------------------------------------
const Container = styled('div', {
    padding: '16px',
    // minWidth: 320,
});

const HeaderWrap = styled('div', {});

const FormEl = styled('form', {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
});

const FieldsetEl = styled('fieldset', {
    border: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: 12,
});

const InputEl = styled('input', {
    padding: '8px 10px',
    borderRadius: 6,
    border: '1px solid $colors$gray400',
    fontSize: '1rem',
});

// Use centralized Button primitive from stitches.config.ts

// Small header node
const header = (
    <HeaderWrap>
        <Text tone="heading">New</Text>
    </HeaderWrap>
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
        <InputEl
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
            disabled={disabled}
            data-testid="submit-button"
            tone="primary"
            size="md"
            style={{ padding: '8px 12px', borderRadius: 6 }}
        >
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
        <Container>
            {header}
            <FormEl onSubmit={handleSubmit}>
                <FieldsetEl>
                    <SourceDocSelect options={sourceDocOptions} value={selectedSourceDocIdStr} onChange={handleSourceDocChange} />
                    <TitleInput value={title} onChange={handleTitleChange} />
                    <SubmitButton loading={loading} disabled={isSubmitDisabled} />
                </FieldsetEl>
            </FormEl>
        </Container>
    );
}

MetatextCreateForm.displayName = 'MetatextCreateForm';
export default MetatextCreateForm;
