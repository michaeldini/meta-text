import { HiOutlineSparkles } from 'react-icons/hi2';
import React from 'react';
import { styled, css, buttonStyles } from '@styles';
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

const HeadingEl = styled('h3', {
    fontSize: '0.95rem',
    margin: 0,
    marginBottom: '12px',
    fontWeight: 600,
});

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

const ButtonEl = styled('button', {
    ...buttonStyles,
    background: '$colors$buttonPrimaryBg',
    color: '$colors$buttonPrimaryText',
    padding: '8px 12px',
    borderRadius: 6,
    '&:disabled': {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
});

// Small header node
const header = (
    <HeaderWrap>
        <HeadingEl>New</HeadingEl>
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
        <ButtonEl type="submit" disabled={disabled} data-testid="submit-button">
            <HiOutlineSparkles style={{ marginRight: 8 }} />
            {loading ? 'Creating...' : 'Create Metatext'}
        </ButtonEl>
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
