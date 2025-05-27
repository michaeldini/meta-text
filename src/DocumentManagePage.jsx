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

    // Meta-text state
    const [selectedDoc, setSelectedDoc] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [metaError, setMetaError] = useState('');
    const [metaSuccess, setMetaSuccess] = useState('');
    const [metaLoading, setMetaLoading] = useState(false);

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
    }, [uploadSuccess, metaSuccess]);

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

    // Meta-text handlers
    const handleMetaSubmit = async (e) => {
        e.preventDefault();
        setMetaError('');
        setMetaSuccess('');
        if (!selectedDoc || !newLabel) {
            setMetaError('Please select a document and enter a label.');
            return;
        }
        setMetaLoading(true);
        try {
            const res = await fetch('/api/create-split-document', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sourceLabel: selectedDoc, newLabel }),
            });
            if (res.ok) {
                setMetaSuccess('Meta-text created!');
                setNewLabel('');
                setSelectedDoc('');
            } else {
                const data = await res.json();
                setMetaError(data.error || 'Failed to create meta-text.');
            }
        } catch {
            setMetaError('Failed to create meta-text.');
        }
        setMetaLoading(false);
    };

    return (
        <div className="document-manage-page">
            <h2>Manage Documents</h2>
            <div className="manage-sections">
                <section>
                    <h3>Upload A Source Document</h3>
                    <form onSubmit={handleUploadSubmit} className="upload-form">
                        <div className="inline-inputs">
                            <input
                                id="file-upload"
                                type="file"
                                accept=".txt"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="file-upload" className="input-file-label">
                                {file ? 'Change Source Document' : 'Choose Source Document'}
                            </label>
                            {file && <span className="file-name">{file.name}</span>}
                            <input
                                type="text"
                                className="input-text"
                                value={uploadLabel}
                                onChange={handleUploadLabelChange}
                                placeholder="Label"
                            />
                        </div>
                        <button type="submit" disabled={uploadLoading}>{uploadLoading ? 'Uploading...' : 'Upload'}</button>
                    </form>
                    {uploadError && <div className="error-msg">{uploadError}</div>}
                    {uploadSuccess && <div className="success-msg">{uploadSuccess}</div>}
                </section>
                <section className="meta-section">
                    <h3>Start a New Meta-Text</h3>
                    <form onSubmit={handleMetaSubmit} className="meta-form">
                        <label>
                            <select
                                value={selectedDoc}
                                onChange={e => setSelectedDoc(e.target.value)}
                                className="meta-select"
                                disabled={loadingDocs}
                            >
                                <option value="">Choose source</option>
                                {docs.map((doc, idx) => (
                                    <option key={idx} value={doc}>{doc}</option>
                                ))}
                            </select>
                        </label>
                        <label className="meta-label">
                            <input
                                type="text"
                                className="input-text"
                                value={newLabel}
                                onChange={e => setNewLabel(e.target.value)}
                                placeholder="Label"
                            />
                        </label>
                        <button type="submit" disabled={metaLoading} className>
                            {metaLoading ? 'Creating...' : 'Create'}
                        </button>
                    </form>
                    {metaError && <div className="meta-error">{metaError}</div>}
                    {metaSuccess && <div className="meta-success">{metaSuccess}</div>}
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
