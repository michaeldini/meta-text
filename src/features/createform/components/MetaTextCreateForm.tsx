import React, { useState } from 'react';
import SourceDocSelect from './SourceDocSelect';
import { createMetaText } from '../../../services/metaTextService';
import log from '../../../utils/logger';
import CreateFormContainer from './CreateForm';
import { useFormStatus } from '../hooks/useFormStatus';
import { handleFormSubmit } from '../utils/handleFormSubmit';
import SubmitButton from './SubmitButton';
import TitleField from './TitleField';

export interface MetaTextCreateFormProps {
    sourceDocs: Array<{ id: string | number; title: string }>;
    sourceDocsLoading: boolean;
    sourceDocsError: string | null;
    onCreateSuccess?: () => void;
}

const MetaTextCreateForm: React.FC<MetaTextCreateFormProps> = ({
    sourceDocs,
    sourceDocsLoading,
    sourceDocsError,
    onCreateSuccess
}) => {
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

    React.useEffect(() => {
        log.info('MetaTextCreateForm mounted');
        return () => log.info('MetaTextCreateForm unmounted');
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        handleFormSubmit({
            e,
            resetStatus,
            setLoading,
            setError,
            setSuccess,
            action: async () => {
                const sourceDocIdNum = Number(selectedSourceDocId);
                if (isNaN(sourceDocIdNum)) throw new Error('Please select a valid source document.');
                await createMetaText(sourceDocIdNum, title);
            },
            validate: () => {
                if (!selectedSourceDocId) return 'Please select a source document.';
                if (!title.trim()) return 'Meta Text Title is required.';
                return null;
            },
            onSuccess: onCreateSuccess,
            resetFields: () => {
                setSelectedSourceDocId('');
                setTitle('');
            },
            successMsg: 'Meta-text created!'
        });
    };

    return (
        <CreateFormContainer
            title="New Meta Text"
            onSubmit={handleSubmit}
            error={error}
            success={success}
            loading={loading}
        >
            <SourceDocSelect
                value={selectedSourceDocId}
                onChange={e => setSelectedSourceDocId(e.target.value)}
                sourceDocs={sourceDocs}
                loading={sourceDocsLoading}
                error={sourceDocsError}
                required
            />
            <TitleField
                value={title}
                onChange={e => setTitle(e.target.value)}
                loading={loading}
                data-testid="meta-text-title"
                id="meta-text-title"
                label="Meta Text Title"
            />
            <SubmitButton loading={loading} disabled={!title.trim() || !selectedSourceDocId}>
                {loading ? 'Creating...' : 'Create'}
            </SubmitButton>
        </CreateFormContainer>
    );
};

export default MetaTextCreateForm;
