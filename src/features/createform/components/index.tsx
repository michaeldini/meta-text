import React, { useState } from 'react';
import { Box, ToggleButton, ToggleButtonGroup, TextField } from '@mui/material';
import FileUploadWidget from './FileUploadWidget';
import SourceDocSelect from './Select';
import { createSourceDocument } from '../../../services/sourceDocumentService';
import { createMetaText } from '../../../services/metaTextService';
import log from '../../../utils/logger';
import CreateFormContainer from './Container';
import { useFormStatus } from '../hooks/useFormStatus';
import { handleFormSubmit } from '../utils/handleFormSubmit';
import SubmitButton from './SubmitButton';

export interface CreateFormProps {
    sourceDocs: Array<{ id: string | number; title: string }>;
    sourceDocsLoading: boolean;
    sourceDocsError: string | null;
    onSuccess?: () => void;
}

type Mode = 'upload' | 'metaText';

const CreateForm: React.FC<CreateFormProps> = ({
    sourceDocs,
    sourceDocsLoading,
    sourceDocsError,
    onSuccess
}) => {
    const [mode, setMode] = useState<Mode>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [selectedSourceDocId, setSelectedSourceDocId] = useState<string>('');
    const {
        title,
        setTitle,
        error,
        setError,
        success,
        setSuccess,
        loading,
        setLoading,
        resetStatus,
    } = useFormStatus();

    const handleModeChange = (_event: React.MouseEvent<HTMLElement>, newMode: Mode | null) => {
        if (newMode) {
            setMode(newMode);
            resetStatus();
            setFile(null);
            setSelectedSourceDocId('');
            setTitle('');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files ? e.target.files[0] : null);
        resetStatus();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        handleFormSubmit({
            e,
            resetStatus,
            setLoading,
            setError,
            setSuccess,
            action: async () => {
                if (mode === 'upload') {
                    if (!file) throw new Error('Please select a file to upload.');
                    await createSourceDocument(title, file);
                } else {
                    const sourceDocIdNum = Number(selectedSourceDocId);
                    if (isNaN(sourceDocIdNum)) throw new Error('Please select a valid source document.');
                    await createMetaText(sourceDocIdNum, title);
                }
            },
            validate: () => {
                if (!title.trim()) return 'Title is required.';
                if (mode === 'upload') {
                    if (!file) return 'Please select a file to upload.';
                } else {
                    if (!selectedSourceDocId) return 'Please select a source document.';
                }
                return null;
            },
            onSuccess,
            resetFields: () => {
                setFile(null);
                setSelectedSourceDocId('');
                setTitle('');
            },
            successMsg: mode === 'upload' ? 'Upload successful!' : 'Meta-text created!'
        });
    };

    React.useEffect(() => {
        log.info('CombinedCreateForm mounted');
        return () => log.info('CombinedCreateForm unmounted');
    }, []);

    const sourceDocMsg = 'Upload a text file to create a new source document.';
    const metaTextMsg = 'Choose a source document to create a new meta text.';
    return (
        <CreateFormContainer
            description={mode === 'upload' ? sourceDocMsg : metaTextMsg}
            onSubmit={handleSubmit}
            error={error}
            success={success}
            loading={loading}
        >
            {/* Choose source doc/meta text */}
            <Box sx={{ mb: 2 }}>
                <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={handleModeChange}
                    aria-label="form mode"
                >
                    <ToggleButton value="upload" aria-label="upload">
                        Source Document
                    </ToggleButton>
                    <ToggleButton value="metaText" aria-label="metaText">
                        Meta-Text
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Display correct component depending on mode */}
            {mode === 'upload' ? (
                <FileUploadWidget file={file} onFileChange={handleFileChange} />
            ) : (
                <SourceDocSelect
                    value={selectedSourceDocId}
                    onChange={e => setSelectedSourceDocId(e.target.value)}
                    sourceDocs={sourceDocs}
                    loading={sourceDocsLoading}
                    error={sourceDocsError}
                    required
                />
            )}
            <TextField
                value={title}
                onChange={e => setTitle(e.target.value)}
                label={mode === 'upload' ? 'Enter the title of your document' : 'Choose a title for your meta text'}
                fullWidth
                margin="normal"
                disabled={loading}
                data-testid={mode === 'upload' ? 'upload-title' : 'meta-text-title'}
                id={mode === 'upload' ? 'upload-title' : 'meta-text-title'}
                required
            />
            <SubmitButton
                loading={loading}
                disabled={
                    loading ||
                    !title.trim() ||
                    (mode === 'upload' ? !file : !selectedSourceDocId)
                }
            >
                {loading ? (mode === 'upload' ? 'Uploading...' : 'Creating...') : (mode === 'upload' ? 'Upload' : 'Create')}
            </SubmitButton>
        </CreateFormContainer>
    );
};

export default CreateForm;
