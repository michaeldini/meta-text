import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import FileName from './FileName';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';

export default function SourceDocumentUploadForm({
    file,
    uploadLabel,
    uploadError,
    uploadSuccess,
    uploadLoading,
    onFileChange,
    onLabelChange,
    onSubmit
}) {
    return (
        <section>
            <h4>New Source Document</h4>
            <form onSubmit={onSubmit} className="upload-form">
                <div className="stacked-inputs">
                    <input
                        id="file-upload"
                        type="file"
                        accept=".txt"
                        onChange={onFileChange}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="file-upload" className="input-file-label">
                        <FontAwesomeIcon icon={faUpload} style={{ marginRight: '0.5em' }} />
                        {file ? 'Change File' : 'Upload File'}
                    </label>
                    <FileName name={file && file.name} />
                    <input
                        type="text"
                        className="input-text"
                        value={uploadLabel}
                        onChange={onLabelChange}
                        placeholder="Label"
                    />
                    <button type="submit" disabled={uploadLoading}>
                        {uploadLoading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </form>
            <ErrorMessage>{uploadError}</ErrorMessage>
            <SuccessMessage>{uploadSuccess}</SuccessMessage>
        </section>
    );
}
