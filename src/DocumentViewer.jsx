import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DocumentViewer.css";

const META_FIELDS = ["notes", "summary", "aiImageUrl", "aiSummary"];

export default function DocumentViewer() {
    const { name } = useParams();
    const [sections, setSections] = useState([]);
    const [editSections, setEditSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleMeta, setVisibleMeta] = useState({
        notes: true,
        summary: true,
        aiImageUrl: true,
        aiSummary: true,
    });
    const [saveStatus, setSaveStatus] = useState(null);
    const [horizontalScroll, setHorizontalScroll] = useState(false);
    const [autoSaveTimeout, setAutoSaveTimeout] = useState(null);
    const [aiSummaryLoading, setAiSummaryLoading] = useState([]);
    const [aiSummaryError, setAiSummaryError] = useState([]);

    useEffect(() => {
        async function fetchDocument() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/get-split-document/${name}`);
                if (!res.ok) throw new Error("Failed to fetch document");
                const data = await res.json();
                setSections(data.sections || []);
                setEditSections(data.sections ? data.sections.map(s => ({ ...s })) : []);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        if (name) fetchDocument();
        // Reset per-row loading/error when document changes
        setAiSummaryLoading([]);
        setAiSummaryError([]);
    }, [name]);

    const handleToggleMeta = (field) => {
        setVisibleMeta((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleEditChange = (idx, field, value) => {
        setEditSections((prev) => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], [field]: value };
            return updated;
        });
        // Autosave logic
        if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
        setAutoSaveTimeout(setTimeout(() => {
            handleSave();
        }, 800)); // 800ms debounce
    };

    const handleSave = async () => {
        setSaveStatus(null);
        try {
            const res = await fetch("/api/save-split-document", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, sections: editSections }),
            });
            if (!res.ok) throw new Error("Failed to save document");
            setSections(editSections.map(s => ({ ...s })));
            setSaveStatus("success");
        } catch {
            setSaveStatus("error");
        }
    };

    const handleGenerateAiSummary = async (idx) => {
        setAiSummaryLoading((prev) => {
            const arr = [...prev];
            arr[idx] = true;
            return arr;
        });
        setAiSummaryError((prev) => {
            const arr = [...prev];
            arr[idx] = null;
            return arr;
        });
        try {
            const res = await fetch("/api/ai-complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: editSections[idx]?.content || "" }),
            });
            if (!res.ok) throw new Error("AI summary failed");
            const data = await res.json();
            setEditSections((prev) => {
                const arr = [...prev];
                arr[idx] = { ...arr[idx], aiSummary: data.result };
                return arr;
            });
            setAiSummaryLoading((prev) => {
                const arr = [...prev];
                arr[idx] = false;
                return arr;
            });
        } catch (e) {
            setAiSummaryError((prev) => {
                const arr = [...prev];
                arr[idx] = e.message || "Error generating summary";
                return arr;
            });
            setAiSummaryLoading((prev) => {
                const arr = [...prev];
                arr[idx] = false;
                return arr;
            });
        }
    };

    // Clean up autosave timeout on unmount
    useEffect(() => {
        return () => {
            if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
        };
    }, [autoSaveTimeout]);

    if (loading) return <div className="docviewer-loading">Loading...</div>;
    if (error) return <div className="docviewer-error">{error}</div>;

    return (
        <div className="docviewer-container">
            <h2>Viewing: {name}</h2>
            <div className="docviewer-meta-controls">
                <button onClick={handleSave} className="docviewer-save-btn" style={{ marginTop: 16 }}>Save All</button>
                {saveStatus === "success" && <span className="docviewer-save-success">Saved!</span>}
                {saveStatus === "error" && <span className="docviewer-save-error">Save failed</span>}
                <label className="docviewer-toggle-label">
                    <span className="docviewer-toggle-text">Horizontal Scroll</span>
                    <span className="docviewer-toggle-switch">
                        <input
                            type="checkbox"
                            checked={horizontalScroll}
                            onChange={() => setHorizontalScroll(v => !v)}
                            className="docviewer-toggle-input"
                        />
                        <span className="docviewer-toggle-slider" />
                    </span>
                </label>
                {META_FIELDS.map((field) => (
                    <label key={field} className="docviewer-toggle-label">
                        <span className="docviewer-toggle-text">{field}</span>
                        <span className="docviewer-toggle-switch">
                            <input
                                type="checkbox"
                                checked={visibleMeta[field]}
                                onChange={() => handleToggleMeta(field)}
                                className="docviewer-toggle-input"
                            />
                            <span className="docviewer-toggle-slider" />
                        </span>
                    </label>
                ))}
            </div>
            <div className={"docviewer-table-outer-wrapper" + (horizontalScroll ? " docviewer-table-scroll" : "")}>
                <div className="docviewer-table-wrapper">
                    <table className="docviewer-table">
                        <thead>
                            <tr>
                                <th className="docviewer-content-header">Content</th>
                                {META_FIELDS.map(
                                    (field) =>
                                        visibleMeta[field] && <th key={field} className={`docviewer-meta-header docviewer-${field}-header`}>{field}</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {sections.map((section, idx) => (
                                <tr key={idx}>
                                    <td className="docviewer-content">{section.content}</td>
                                    {META_FIELDS.map(
                                        (field) =>
                                            visibleMeta[field] && (
                                                <td key={field} className={`docviewer-meta docviewer-${field}`}>
                                                    {['notes', 'summary'].includes(field) ? (
                                                        <textarea
                                                            ref={el => {
                                                                if (el) {
                                                                    el.style.height = 'auto';
                                                                    el.style.height = el.scrollHeight + 'px';
                                                                }
                                                            }}
                                                            value={editSections[idx]?.[field] || ''}
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
                                                                {aiSummaryLoading[idx] ? "Generating..." : "Generate"}
                                                            </button>
                                                            {aiSummaryError[idx] && (
                                                                <div className="docviewer-ai-summary-error">{aiSummaryError[idx]}</div>
                                                            )}
                                                            <div className="docviewer-ai-summary-text">
                                                                {editSections[idx]?.aiSummary || <span className="docviewer-empty">—</span>}
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
