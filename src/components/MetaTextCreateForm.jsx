import React from 'react';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';

export default function MetaTextCreateForm({
    docs,
    selectedDoc,
    newLabel,
    metaError,
    metaSuccess,
    metaLoading,
    loadingDocs,
    onDocChange,
    onLabelChange,
    onSubmit
}) {
    return (
        <section className="meta-section">
            <h4>New Meta-Text</h4>
            <form onSubmit={onSubmit} className="meta-form">
                <div className="stacked-inputs">
                    <label>
                        <select
                            value={selectedDoc}
                            onChange={onDocChange}
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
                            onChange={onLabelChange}
                            placeholder="Label"
                        />
                    </label>
                    <button type="submit" disabled={metaLoading}>
                        {metaLoading ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </form>
            <ErrorMessage>{metaError}</ErrorMessage>
            <SuccessMessage>{metaSuccess}</SuccessMessage>
        </section>
    );
}
