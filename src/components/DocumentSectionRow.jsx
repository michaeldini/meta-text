import React from "react";

export default function DocumentSectionRow({
    section,
    editSection,
    idx,
    META_FIELDS,
    visibleMeta,
    handleEditChange,
    handleGenerateAiSummary,
    handleGenerateAiThemes,
    aiSummaryLoading,
    aiSummaryError,
    aiThemesLoading,
    aiThemesError
}) {
    return (
        <tr>
            {META_FIELDS.map(
                (field) =>
                    visibleMeta[field] && (
                        <td key={field} className={`docviewer-meta docviewer-${field}`}>
                            {field === "content" ? (
                                section.content
                            ) : ['notes', 'summary'].includes(field) ? (
                                <textarea
                                    ref={el => {
                                        if (el) {
                                            el.style.height = 'auto';
                                            el.style.height = el.scrollHeight + 'px';
                                        }
                                    }}
                                    value={editSection?.[field] || ''}
                                    onChange={e => {
                                        handleEditChange(idx, field, e.target.value);
                                        if (e.target) {
                                            e.target.style.height = 'auto';
                                            e.target.style.height = e.target.scrollHeight + 'px';
                                        }
                                    }}
                                    className="docviewer-edit-textarea"
                                    rows={1}
                                />
                            ) : field === "aiSummary" ? (
                                <div className="docviewer-ai-summary-cell">
                                    <button
                                        className="docviewer-ai-summary-btn"
                                        onClick={() => handleGenerateAiSummary(idx)}
                                        disabled={aiSummaryLoading[idx]}
                                        style={{ marginBottom: 4 }}
                                    >
                                        {aiSummaryLoading[idx] ? "Generating..." : (
                                            <span role="img" aria-label="Generate">✨</span>
                                        )}
                                    </button>
                                    {aiSummaryError[idx] && (
                                        <div className="docviewer-ai-summary-error">{aiSummaryError[idx]}</div>
                                    )}
                                    <div className="docviewer-ai-summary-text">
                                        {editSection?.aiSummary || ''}
                                    </div>
                                </div>
                            ) : field === "aiThemes" ? (
                                <div className="docviewer-ai-themes-cell">
                                    <button
                                        className="docviewer-ai-themes-btn"
                                        onClick={() => handleGenerateAiThemes(idx)}
                                        disabled={aiThemesLoading[idx]}
                                        style={{ marginBottom: 4 }}
                                    >
                                        {aiThemesLoading[idx] ? "Generating..." : <span role="img" aria-label="Generate">✨</span>}
                                    </button>
                                    {aiThemesError[idx] && (
                                        <div className="docviewer-ai-themes-error">{aiThemesError[idx]}</div>
                                    )}
                                    <div className="docviewer-ai-themes-text">
                                        {editSection?.aiThemes || ''}
                                    </div>
                                </div>
                            ) : field === "aiImageUrl" && section[field] ? (
                                <img
                                    src={section[field]}
                                    alt="AI generated"
                                    className="docviewer-image"
                                />
                            ) : (
                                section[field] || <span className="docviewer-empty">—</span>
                            )}
                        </td>
                    )
            )}
        </tr>
    );
}
