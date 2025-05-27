import React, { useState, useEffect } from 'react';
import './DocumentManagePage.css';

export default function DocumentManagePage() {
    // Shared state
    const [docs, setDocs] = useState([]);
    const [loadingDocs, setLoadingDocs] = useState(false);

    // Upload state
    const [file, setFile] = useState(null);
    const [uploadLabel, setUploadLabel] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    const [uploadLoading, setUploadLoading] = useState(false);

    // Split-document state
    const [selectedDoc, setSelectedDoc] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [splitError, setSplitError] = useState('');
    const [splitSuccess, setSplitSuccess] = useState('');
    const [splitLoading, setSplitLoading] = useState(false);

    // Fetch docs
    const fetchDocs = () => {
        setLoadingDocs(true);
        fetch('/api/list-texts')
            .then(res => res.json())
            .then(data => setDocs(data.texts || []))
            .catch(() => setDocs([]))
            .finally(() => setLoadingDocs(false));
    };

    useEffect(() => {
        fetchDocs();
    }, [uploadSuccess, splitSuccess]);

    // Upload handlers
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setUploadError('');
        setUploadSuccess('');
    };
    const handleUploadLabelChange = (e) => {
        setUploadLabel(e.target.value);
        setUploadError('');
        setUploadSuccess('');
    };
    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!file || !uploadLabel) {
            setUploadError('Please select a file and enter a label.');
            return;
        }
        setUploadLoading(true);
        setUploadError('');
        setUploadSuccess('');
        const formData = new FormData();
        formData.append('label', uploadLabel);
        formData.append('file', file);
        try {
            const res = await fetch('/api/save-text', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                setUploadSuccess('File uploaded successfully!');
                setFile(null);
                setUploadLabel('');
            } else {
                const data = await res.json();
                setUploadError(data.error || 'Upload failed.');
            }
        } catch {
            setUploadError('Upload failed.');
        }
        setUploadLoading(false);
    };

    // Split-document handlers
    const handleSplitSubmit = async (e) => {
        e.preventDefault();
        setSplitError('');
        setSplitSuccess('');
        if (!selectedDoc || !newLabel) {
            setSplitError('Please select a document and enter a label.');
            return;
        }
        setSplitLoading(true);
        try {
            const res = await fetch('/api/create-split-document', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sourceLabel: selectedDoc, newLabel }),
            });
            if (res.ok) {
                setSplitSuccess('Meta-document created!');
                setNewLabel('');
                setSelectedDoc('');
            } else {
                const data = await res.json();
                setSplitError(data.error || 'Failed to create split-document.');
            }
        } catch {
            setSplitError('Failed to create split-document.');
        }
        setSplitLoading(false);
    };

    return (
        <div className="document-manage-page">
            <h2>Manage Documents</h2>
            <div className="manage-sections">
                <section className="upload-section">
                    <h3>Upload Text File</h3>
                    <form onSubmit={handleUploadSubmit} className="upload-form">
                        <div className="inline-inputs">
                            <input
                                id="file-upload"
                                type="file"
                                accept=".txt"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="file-upload" className="file-label">
                                {file ? 'Change File' : 'Choose File'}
                            </label>
                            {file && <span className="file-name">{file.name}</span>}
                            <input type="text" placeholder="Label" value={uploadLabel} onChange={handleUploadLabelChange} className="label-input" />
                        </div>
                        <button type="submit" disabled={uploadLoading}>{uploadLoading ? 'Uploading...' : 'Upload'}</button>
                    </form>
                    {uploadError && <div className="error-msg">{uploadError}</div>}
                    {uploadSuccess && <div className="success-msg">{uploadSuccess}</div>}
                </section>
                <section className="split-section">
                    <h3>Start a New Split-Document</h3>
                    <form onSubmit={handleSplitSubmit} className="new-page-form">
                        <label className="new-page-label">
                            Select a source document:
                            <select
                                value={selectedDoc}
                                onChange={e => setSelectedDoc(e.target.value)}
                                className="new-page-select"
                                disabled={loadingDocs}
                            >
                                <option value="">-- Choose --</option>
                                {docs.map((doc, idx) => (
                                    <option key={idx} value={doc}>{doc}</option>
                                ))}
                            </select>
                        </label>
                        <label className="new-page-label">
                            New split-document label:
                            <input
                                type="text"
                                value={newLabel}
                                onChange={e => setNewLabel(e.target.value)}
                                placeholder="Enter new label"
                                className="new-page-input"
                            />
                        </label>
                        <button type="submit" disabled={splitLoading} className="new-page-submit">
                            {splitLoading ? 'Creating...' : 'Create Split-Document'}
                        </button>
                    </form>
                    {splitError && <div className="new-page-error">{splitError}</div>}
                    {splitSuccess && <div className="new-page-success">{splitSuccess}</div>}
                </section>
            </div>
            <div className="labels-list">
                <h3>Available Texts</h3>
                {loadingDocs ? (
                    <p>Loading...</p>
                ) : docs.length === 0 ? (
                    <p>No texts available.</p>
                ) : (
                    <ul>
                        {docs.map((lbl, idx) => (
                            <li key={idx}>{lbl}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
