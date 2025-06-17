import React, { useState } from 'react';
import FileUploadWidget from './FileUploadWidget';
import { createSourceDocument } from '../../../services/sourceDocumentService';
import log from '../../../utils/logger';
import CreateFormContainer from './CreateForm';
import { useFormStatus } from '../hooks/useFormStatus';
import { handleFormSubmit } from '../utils/handleFormSubmit';
import SubmitButton from './SubmitButton';
import TitleField from './TitleField';

export interface SourceDocUploadFormProps {
    refresh?: () => void;
}

const SourceDocUploadForm: React.FC<SourceDocUploadFormProps> = ({ refresh }) => {
    const [file, setFile] = useState<File | null>(null);
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
                if (!file) throw new Error('Please select a file to upload.');
                await createSourceDocument(title, file);
            },
            validate: () => {
                if (!file) return 'Please select a file to upload.';
                if (!title.trim()) return 'Title is required.';
                return null;
            },
            onSuccess: refresh,
            resetFields: () => {
                setFile(null);
                setTitle('');
            },
            successMsg: 'Upload successful!'
        });
    };

    React.useEffect(() => {
        log.info('SourceDocUploadForm mounted');
        return () => log.info('SourceDocUploadForm unmounted');
    }, []);

    return (
        <CreateFormContainer
            title="New Source Document"
            onSubmit={handleSubmit}
            error={error}
            success={success}
            loading={loading}
        >
            <FileUploadWidget file={file} onFileChange={handleFileChange} />
            <TitleField
                value={title}
                onChange={e => setTitle(e.target.value)}
                loading={loading}
                data-testid="upload-title"
                id="upload-title"
            />
            <SubmitButton loading={loading} disabled={!title.trim() || !file}>
                {loading ? 'Uploading...' : 'Upload'}
            </SubmitButton>
        </CreateFormContainer>
    );
};

export default SourceDocUploadForm;
