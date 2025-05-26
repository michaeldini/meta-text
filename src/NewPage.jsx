import React, { useState, useEffect } from 'react';
import './NewPage.css';

export default function NewPage() {
    const [docs, setDocs] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetch('/api/list-texts')
            .then(res => res.json())
            .then(data => setDocs(data.texts || []))
            .catch(() => setDocs([]));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!selectedDoc || !newLabel) {
            setError('Please select a document and enter a label.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/create-split-document', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sourceLabel: selectedDoc, newLabel }),
            });
            if (res.ok) {
                setSuccess('Meta-document created!');
                setNewLabel('');
                setSelectedDoc('');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to create split-document.');
            }
        } catch {
            setError('Failed to create split-document.');
        }
        setLoading(false);
    };

    return (
        <div className="new-page-container">
            <h2 className="new-page-title">Start a New Split-Document</h2>
            <form onSubmit={handleSubmit} className="new-page-form">
                <label className="new-page-label">
                    Select a source document:
                    <select
                        value={selectedDoc}
                        onChange={e => setSelectedDoc(e.target.value)}
                        className="new-page-select"
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
                <button type="submit" disabled={loading} className="new-page-submit">
                    {loading ? 'Creating...' : 'Create Split-Document'}
                </button>
            </form>
            {error && <div className="new-page-error">{error}</div>}
            {success && <div className="new-page-success">{success}</div>}
        </div>
    );
}
