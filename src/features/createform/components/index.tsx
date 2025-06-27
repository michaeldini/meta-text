// CreateForm is a "smart" form orchestrator: it manages state via useCreateForm, handles mode switching, and renders the correct input widgets and submit logic.

import React, { useMemo, useCallback } from 'react';
import { TextField, Typography } from '@mui/material';
import FileUploadWidget from './FileUploadWidget';
import SourceDocSelect from './Select';
import CreateFormContainer from './Container';
import SubmitButton from './SubmitButton';
import { useCreateForm } from '../hooks/useCreateForm';
import { SourceDocument, FormMode } from '../types';
import { FORM_MODES, FORM_MESSAGES, FORM_A11Y } from '../constants';

export enum DocType {
    SourceDoc = 'sourceDoc',
    MetaText = 'metaText'
}

export interface CreateFormProps {
    sourceDocs: SourceDocument[];
    sourceDocsLoading: boolean;
    sourceDocsError: string | null;
    onSuccess?: () => void;
    docType: DocType;
    title?: string; // New prop for title
}

const CreateForm: React.FC<CreateFormProps> = React.memo(({
    sourceDocs,
    sourceDocsLoading,
    sourceDocsError,
    onSuccess,
    docType,
    title // Destructure title
}) => {
    // Convert docType to FormMode - memoized to prevent unnecessary recalculations
    const mode: FormMode = useMemo(() =>
        docType === DocType.SourceDoc ? FORM_MODES.UPLOAD : FORM_MODES.META_TEXT,
        [docType]
    );

    // Use the new custom hook for all business logic
    const form = useCreateForm({
        mode, // controlled mode
        onSuccess,
        sourceDocs
    });

    // Memoized event handlers
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        form.setFile(file);
    }, [form.setFile]);

    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.submit();
    }, [form.submit]);

    const handleSourceDocChange = useCallback((e: any) => {
        form.setSourceDocId(e.target.value);
    }, [form.setSourceDocId]);

    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        form.setTitle(e.target.value);
    }, [form.setTitle]);

    // Use single-source-of-truth from hook
    const isSubmitDisabled = form.isSubmitDisabled;

    // Memoized dynamic content
    const formContent = useMemo(() => ({
        description: FORM_MESSAGES.DESCRIPTIONS[form.mode],
        titleLabel: FORM_MESSAGES.LABELS.TITLE[form.mode],
        submitText: form.loading
            ? FORM_MESSAGES.LOADING[form.mode]
            : FORM_MESSAGES.SUBMIT[form.mode],
        titleId: form.mode === FORM_MODES.UPLOAD ? FORM_A11Y.IDS.UPLOAD_TITLE : FORM_A11Y.IDS.META_TEXT_TITLE
    }), [form.mode, form.loading]);

    return (
        <>
            <CreateFormContainer
                title={title}
                description={formContent.description}
                onSubmit={handleSubmit}
                error={form.error}
                success={form.success}
                loading={form.loading}
            >
                {/* Mode-specific input widget */}
                {form.mode === FORM_MODES.UPLOAD ? (
                    <FileUploadWidget
                        file={form.data.file}
                        onFileChange={handleFileChange}
                        id={FORM_A11Y.IDS.FILE_UPLOAD}
                    />
                ) : (
                    <SourceDocSelect
                        value={form.data.sourceDocId || ''}
                        onChange={handleSourceDocChange}
                        sourceDocs={sourceDocs}
                        loading={sourceDocsLoading}
                        error={sourceDocsError}
                        required
                        id={FORM_A11Y.IDS.SOURCE_DOC_SELECT}
                        aria-label={FORM_A11Y.LABELS.SOURCE_DOC_SELECT}
                    />
                )}

                {/* Title input with accessibility features */}
                <TextField
                    value={form.data.title}
                    onChange={handleTitleChange}
                    label={formContent.titleLabel}
                    fullWidth
                    margin="normal"
                    disabled={form.loading}
                    data-testid={formContent.titleId}
                    id={formContent.titleId}
                    required
                    autoComplete="off"
                />

                {/* Submit button */}
                <SubmitButton
                    loading={form.loading}
                    disabled={isSubmitDisabled}
                >
                    {formContent.submitText}
                    {form.loading && (
                        <span id="submit-loading-text" className="sr-only">
                            Form is being submitted, please wait.
                        </span>
                    )}
                </SubmitButton>
            </CreateFormContainer>
        </>
    );
});

export default CreateForm;
