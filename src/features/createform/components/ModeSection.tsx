import React from 'react';
import FileUploadWidget from './FileUploadWidget';
import SourceDocSelect from './Select';
import { FORM_MODES, FORM_A11Y } from '../constants';
import { SourceDocumentSummary } from 'types';

interface ModeSectionProps {
    mode: string;
    file: File | null;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    sourceDocId: string | null;
    onSourceDocChange: (e: any) => void;
    sourceDocs: SourceDocumentSummary[];
    sourceDocsLoading: boolean;
    sourceDocsError: string | null;
}

const ModeSection: React.FC<ModeSectionProps> = ({
    mode,
    file,
    onFileChange,
    sourceDocId,
    onSourceDocChange,
    sourceDocs,
    sourceDocsLoading,
    sourceDocsError
}) => {
    if (mode === FORM_MODES.UPLOAD) {
        return (
            <FileUploadWidget
                file={file}
                onFileChange={onFileChange}
                id={FORM_A11Y.IDS.FILE_UPLOAD}
            />
        );
    }
    return (
        <SourceDocSelect
            value={sourceDocId || ''}
            onChange={onSourceDocChange}
            sourceDocs={sourceDocs}
            loading={sourceDocsLoading}
            error={sourceDocsError}
            required
            id={FORM_A11Y.IDS.SOURCE_DOC_SELECT}
            aria-label={FORM_A11Y.LABELS.SOURCE_DOC_SELECT}
        />
    );
};

export default ModeSection;
