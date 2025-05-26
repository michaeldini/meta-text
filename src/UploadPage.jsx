import React, { useState, useEffect } from 'react';
import './UploadPage.css';

function UploadPage() {
    const [file, setFile] = useState(null);
    const [label, setLabel] = useState('');
    const [labels, setLabels] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/list-texts')
            .then(res => res.json())
            .then(data => setLabels(data.texts || []))
            .catch(() => setLabels([]));
    }, [success]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
        setSuccess('');
    };

    const handleLabelChange = (e) => {
        setLabel(e.target.value);
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !label) {
            setError('Please select a file and enter a label.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');
        const formData = new FormData();
        formData.append('label', label);
        formData.append('file', file);
        try {
            const res = await fetch('/api/save-text', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                setSuccess('File uploaded successfully!');
                setFile(null);
                setLabel('');
            } else {
                console.error('Upload failed:', res.statusText);
                const data = await res.json();
                setError(data.error || 'Upload failed.');
            }
        } catch {
            setError('Upload failed.');
        }
        setLoading(false);
    };

    return (
        <div className="upload-page">
            <h2>Upload Text File</h2>
            <form onSubmit={handleSubmit} className="upload-form">
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
                <input type="text" placeholder="Label" value={label} onChange={handleLabelChange} />
                <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button>
            </form>
            {error && <div className="error-msg">{error}</div>}
            {success && <div className="success-msg">{success}</div>}
            <div className="labels-list">
                <h3>Available Texts</h3>
                {labels.length === 0 ? (
                    <p>No texts available.</p>
                ) : (
                    <ul>
                        {labels.map((lbl, idx) => (
                            <li key={idx}>{lbl}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default UploadPage;
