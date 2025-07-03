import { useCallback, useMemo } from 'react';
import { useCreateForm } from '../hooks/useCreateForm';
import { FORM_MODES, FORM_MESSAGES, FORM_A11Y } from '../constants';
import { DocType, SourceDocumentSummary } from 'types';

export function useCreateFormWithHandlers({
    docType,
    onSuccess,
    sourceDocs
}: {
    docType: DocType;
    onSuccess?: () => void;
    sourceDocs: SourceDocumentSummary[];
}) {
    // Determine the form mode based on the document type
    const mode = useMemo(
        () => (docType === DocType.SourceDoc ? FORM_MODES.UPLOAD : FORM_MODES.META_TEXT),
        [docType]
    );

    // Initialize the form with the appropriate mode and callbacks
    const form = useCreateForm({ mode, onSuccess, sourceDocs });

    // Handlers for form interactions
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

    // Prepare the form content based on the current mode
    const formContent = useMemo(() => ({
        description: FORM_MESSAGES.DESCRIPTIONS[form.mode],
        titleLabel: FORM_MESSAGES.LABELS.TITLE[form.mode],
        submitText: form.loading
            ? FORM_MESSAGES.LOADING[form.mode]
            : FORM_MESSAGES.SUBMIT[form.mode],
        titleId: form.mode === FORM_MODES.UPLOAD ? FORM_A11Y.IDS.UPLOAD_TITLE : FORM_A11Y.IDS.META_TEXT_TITLE
    }), [form.mode, form.loading]);

    return {
        form,
        mode,
        handleFileChange,
        handleSubmit,
        handleSourceDocChange,
        handleTitleChange,
        formContent,
        isSubmitDisabled: form.isSubmitDisabled
    };
}
