import React, { useMemo } from 'react';
import { TextField, Paper, Typography, Box, CircularProgress, useTheme } from '@mui/material';

import { SubmitButton, ModeSection } from './components';
import { useCreateFormWithHandlers } from './hooks/useCreateFormWithHandlers';
import { FORM_MODES } from './constants';
import { DocType, SourceDocumentSummary } from 'types';

import { createFormStyles } from './styles/styles';


export interface CreateFormProps {
    sourceDocs: SourceDocumentSummary[];
    sourceDocsLoading: boolean;
    sourceDocsError: string | null;
    onSuccess?: () => void;
    docType: DocType;
}

// Define the type for form modes
// This allows the user to switch between uploading a file or choosing a source document
export type FormMode = typeof FORM_MODES.UPLOAD | typeof FORM_MODES.META_TEXT;

const CreateForm: React.FC<CreateFormProps> = React.memo((props) => {
    const {
        form,
        mode,
        handleFileChange,
        handleSubmit,
        handleSourceDocChange,
        handleTitleChange,
        formContent,
        isSubmitDisabled
    } = useCreateFormWithHandlers(props);

    const theme = useTheme();
    const styles = createFormStyles(theme);

    return (
        <Paper elevation={3} sx={styles.createFormContainer}>
            {props.docType && <Typography variant="h6">{props.docType}</Typography>}
            <Typography variant="body1" gutterBottom>{formContent.description}</Typography>
            <Box component="form" onSubmit={handleSubmit} sx={styles.uploadFormInner}>
                {form.loading && (
                    <Box sx={styles.loadingBoxStyles}>
                        <CircularProgress sx={styles.spinnerStyles} />
                    </Box>
                )}
                <ModeSection
                    mode={form.mode}
                    file={form.data.file}
                    onFileChange={handleFileChange}
                    sourceDocId={form.data.sourceDocId}
                    onSourceDocChange={handleSourceDocChange}
                    sourceDocs={props.sourceDocs}
                    sourceDocsLoading={props.sourceDocsLoading}
                    sourceDocsError={props.sourceDocsError}
                />
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
            </Box>
        </Paper>
    );
});

export default CreateForm;
