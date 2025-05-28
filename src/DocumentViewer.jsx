import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import "./DocumentViewer.css";
import aiStars from './assets/ai-stars.png';

const META_FIELDS = ["content", "summary", "aiSummary", "aiThemes", "notes", "aiImageUrl"];

export default function DocumentViewer() {
    const { name } = useParams();
    const [sections, setSections] = useState([]);
    const [editSections, setEditSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleMeta, setVisibleMeta] = useState({
        content: true,
        notes: false,
        summary: false,
        aiImageUrl: false,
        aiSummary: false,
        aiThemes: false,
    });
    const [saveStatus, setSaveStatus] = useState(null);
    const [horizontalScroll, setHorizontalScroll] = useState(false);
    const [autoSaveTimeout, setAutoSaveTimeout] = useState(null);
    const [aiSummaryLoading, setAiSummaryLoading] = useState([]);
    const [aiSummaryError, setAiSummaryError] = useState([]);
    const [aiThemesLoading, setAiThemesLoading] = useState([]);
    const [aiThemesError, setAiThemesError] = useState([]);

    useEffect(() => {
        async function fetchDocument() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/meta-text/${name}`);
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
        setAiThemesLoading([]);
        setAiThemesError([]);
    }, [name]);

    // Debounced autosave for text input changes
    useEffect(() => {
        if (!editSections.length) return;
        if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
        const timeout = setTimeout(() => {
            handleSave();
        }, 2000); // 2 seconds debounce
        setAutoSaveTimeout(timeout);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editSections]);

    const handleToggleMeta = (field) => {
        setVisibleMeta((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleEditChange = (idx, field, value) => {
        setEditSections((prev) => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], [field]: value };
            return updated;
        });
    };

    const handleSave = async () => {
        setSaveStatus("saving");
        try {
            const res = await fetch("/api/meta-text/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, sections: editSections }),
            });
            if (!res.ok) throw new Error("Failed to save document");
            setSections(editSections.map(s => ({ ...s })));
            // Ensure 'Saving...' is visible for at least 250ms
            setTimeout(() => setSaveStatus(null), 250);
        } catch {
            setSaveStatus("error");
            setTimeout(() => setSaveStatus(null), 2000);
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
            // Update editSections, then save after update
            setEditSections((prev) => {
                const arr = [...prev];
                arr[idx] = { ...arr[idx], aiSummary: data.result };
                return arr;
            });
            // Save after state update
            setTimeout(() => handleSave(), 0);
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

    const handleGenerateAiThemes = async (idx) => {
        setAiThemesLoading((prev) => {
            const arr = [...prev];
            arr[idx] = true;
            return arr;
        });
        setAiThemesError((prev) => {
            const arr = [...prev];
            arr[idx] = null;
            return arr;
        });
        try {
            const res = await fetch("/api/ai-symbolism", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: editSections[idx]?.content || "" }),
            });
            if (!res.ok) throw new Error("AI themes failed");
            const data = await res.json();
            setEditSections((prev) => {
                const arr = [...prev];
                arr[idx] = { ...arr[idx], aiThemes: data.result };
                return arr;
            });
            setTimeout(() => handleSave(), 0);
            setAiThemesLoading((prev) => {
                const arr = [...prev];
                arr[idx] = false;
                return arr;
            });
        } catch (e) {
            setAiThemesError((prev) => {
                const arr = [...prev];
                arr[idx] = e.message || "Error generating themes";
                return arr;
            });
            setAiThemesLoading((prev) => {
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
            <div className="docviewer-header">
                <h2>{name}</h2>
                <button onClick={handleSave} className="docviewer-save-btn" disabled={saveStatus === "saving"}>
                    {saveStatus === "saving" ? "Saving..." : "Save All"}
                </button>
                {saveStatus === "error" && <span className="docviewer-save-error">Save failed</span>}
                <span
                    className={
                        'docviewer-meta-toggle-label' +
                        (horizontalScroll ? ' docviewer-meta-toggle-label--active' : '')
                    }
                    onClick={() => setHorizontalScroll(v => !v)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={horizontalScroll}
                    onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') setHorizontalScroll(v => !v);
                    }}
                    style={{ marginLeft: 12 }}
                >
                    Horizontal Scroll
                </span>
                <div className="docviewer-meta-controls">
                    {META_FIELDS.map((field) => (
                        <span
                            key={field}
                            className={
                                'docviewer-meta-toggle-label' +
                                (visibleMeta[field] ? ' docviewer-meta-toggle-label--active' : '')
                            }
                            onClick={() => handleToggleMeta(field)}
                            tabIndex={0}
                            role="button"
                            aria-pressed={visibleMeta[field]}
                            onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') handleToggleMeta(field);
                            }}
                        >
                            {field}
                        </span>
                    ))}
                </div>
            </div>
            <div className={"docviewer-table-outer-wrapper" + (horizontalScroll ? " docviewer-table-scroll" : "")}>
                <div className="docviewer-table-wrapper">
                    <table className="docviewer-table">
                        <thead>
                            <tr>
                                {META_FIELDS.map(
                                    (field) =>
                                        visibleMeta[field] && <th key={field} className={`docviewer-meta-header docviewer-${field}-header`}>{field}</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {sections.map((section, idx) => (
                                <tr key={idx}>
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
                                                                {aiSummaryLoading[idx] ? "Generating..." : (
                                                                    <img src={aiStars} alt="Generate" style={{ height: 22, verticalAlign: 'middle' }} />
                                                                )}
                                                            </button>
                                                            {aiSummaryError[idx] && (
                                                                <div className="docviewer-ai-summary-error">{aiSummaryError[idx]}</div>
                                                            )}
                                                            <div className="docviewer-ai-summary-text">
                                                                <ReactMarkdown>{editSections[idx]?.aiSummary || ''}</ReactMarkdown>
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
                                                                {aiThemesLoading[idx] ? "Generating..." : <img src={aiStars} alt="Generate" style={{ height: 22, verticalAlign: 'middle' }} />}
                                                            </button>
                                                            {aiThemesError[idx] && (
                                                                <div className="docviewer-ai-themes-error">{aiThemesError[idx]}</div>
                                                            )}
                                                            <div className="docviewer-ai-themes-text">
                                                                <ReactMarkdown>{editSections[idx]?.aiThemes || ''}</ReactMarkdown>
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
