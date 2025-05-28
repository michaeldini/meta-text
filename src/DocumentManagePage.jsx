import React, { useState, useEffect } from 'react';
import './DocumentManagePage.css';
import './DocumentManageSidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';

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

    // Meta-texts (split documents) state
    const [metaTexts, setMetaTexts] = useState([]);
    const [loadingMetaTexts, setLoadingMetaTexts] = useState(false);

    // Fetch docs
    const fetchDocs = () => {
        setLoadingDocs(true);
        fetch('/api/source-documents')
            .then(res => res.json())
            .then(data => setDocs(data.source_documents || []))
            .catch(() => setDocs([]))
            .finally(() => setLoadingDocs(false));
    };

    // Fetch meta-texts
    const fetchMetaTexts = () => {
        setLoadingMetaTexts(true);
        fetch('/api/meta-text')
            .then(res => res.json())
            .then(data => setMetaTexts(data.meta_texts || []))
            .catch(() => setMetaTexts([]))
            .finally(() => setLoadingMetaTexts(false));
    };

    useEffect(() => {
        fetchDocs();
        fetchMetaTexts();
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
            const res = await fetch('/api/source-documents', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                setUploadSuccess('File uploaded successfully!');
                setFile(null);
                setUploadLabel('');
            } else {
                const data = await res.json();
                setUploadError(data.detail || 'Upload failed.');
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
            const res = await fetch('/api/meta-text', {
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
                setMetaError(data.detail || 'Failed to create meta-text.');
            }
        } catch {
            setMetaError('Failed to create meta-text.');
        }
        setMetaLoading(false);
    };

    // Delete a single source document
    const handleDeleteDoc = async (label) => {
        if (!window.confirm(`Delete source document '${label}'?`)) return;
        setLoadingDocs(true);
        try {
            const res = await fetch(`/api/source-documents/${encodeURIComponent(label)}`, { method: 'DELETE' });
            if (res.ok) {
                setDocs(docs.filter(doc => doc !== label));
            }
        } finally {
            setLoadingDocs(false);
        }
    };
    // Delete a single meta-text
    const handleDeleteMetaText = async (label) => {
        if (!window.confirm(`Delete meta-text '${label}'?`)) return;
        setLoadingMetaTexts(true);
        try {
            const res = await fetch(`/api/meta-text/${encodeURIComponent(label)}`, { method: 'DELETE' });
            if (res.ok) {
                setMetaTexts(metaTexts.filter(meta => meta !== label));
            }
        } finally {
            setLoadingMetaTexts(false);
        }
    };

    return (
        <div className="document-manage-page sidebar-layout">
            <aside className="sidebar">
                <section>
                    <h4>New Source Document</h4>
                    <form onSubmit={handleUploadSubmit} className="upload-form">
                        <div className="stacked-inputs">
                            <input
                                id="file-upload"
                                type="file"
                                accept=".txt"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="file-upload" className="input-file-label">
                                <FontAwesomeIcon icon={faUpload} style={{ marginRight: '0.5em' }} />
                                {file ? 'Change File' : 'Upload File'}
                            </label>
                            {file && <span className="file-name">{file.name}</span>}
                            <input
                                type="text"
                                className="input-text"
                                value={uploadLabel}
                                onChange={handleUploadLabelChange}
                                placeholder="Label"
                            />
                            <button type="submit" disabled={uploadLoading}>{uploadLoading ? 'Uploading...' : 'Upload'}</button>
                        </div>
                    </form>
                    {uploadError && <div className="error-msg">{uploadError}</div>}
                    {uploadSuccess && <div className="success-msg">{uploadSuccess}</div>}
                </section>
                <section className="meta-section">
                    <h4>New Meta-Text</h4>
                    <form onSubmit={handleMetaSubmit} className="meta-form">
                        <div className="stacked-inputs">
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
                        </div>
                    </form>
                    {metaError && <div className="meta-error">{metaError}</div>}
                    {metaSuccess && <div className="meta-success">{metaSuccess}</div>}
                </section>

            </aside>
            <main className="main-content">
                <h2>Manage Documents</h2>
                <div className="manage-sections">
                </div>
                <div className="labels-list">
                    <h3>Source Documents</h3>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Label</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingDocs ? (
                                <tr><td colSpan="3">Loading...</td></tr>
                            ) : docs.length === 0 ? (
                                <tr><td colSpan="3">No texts available.</td></tr>
                            ) : (
                                docs.map((lbl, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td>{lbl}</td>
                                        <td>
                                            <button onClick={() => handleDeleteDoc(lbl)} disabled={loadingDocs} className="danger-btn" aria-label="Delete">
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="meta-texts-list">
                    <h3>Meta-Texts</h3>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Label</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingMetaTexts ? (
                                <tr><td colSpan="3">Loading...</td></tr>
                            ) : metaTexts.length === 0 ? (
                                <tr><td colSpan="3">No meta-texts available.</td></tr>
                            ) : (
                                metaTexts.map((name, idx) => (
                                    <tr key={idx}>
                                        <td>{idx + 1}</td>
                                        <td>{name}</td>
                                        <td>
                                            <button onClick={() => handleDeleteMetaText(name)} disabled={loadingMetaTexts} className="danger-btn" aria-label="Delete">
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
