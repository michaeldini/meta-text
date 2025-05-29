import React from 'react';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';

export default function MetaTextSelect({ splitDocs, selectedDoc, setSelectedDoc, loading, error }) {
    return (
        <div className="editpage-input-row">
            <h2 className="editpage-split-header">Select Meta-Text</h2>
            <select
                className="editpage-select"
                value={selectedDoc}
                onChange={e => setSelectedDoc(e.target.value)}
            >
                <option value="">-- Choose a split-document --</option>
                {splitDocs.map((name, idx) => (
                    <option key={idx} value={name}>{name}</option>
                ))}
            </select>
            {loading && <SuccessMessage message="Loading..." />}
            {error && <ErrorMessage message={error} />}
        </div>
    );
}
