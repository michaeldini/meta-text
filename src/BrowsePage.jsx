import React, { useEffect, useState } from "react";
import "./BrowsePage.css";
import chatgptLogo from './assets/ChatGPT_logo.svg.png';

// AiSummaryResponse schema fields
const SUMMARY_FIELDS = [
    { key: "title", label: "Title" },
    { key: "summary", label: "Summary" },
    { key: "characters", label: "Characters" },
    { key: "locations", label: "Locations" },
    { key: "themes", label: "Themes" },
    { key: "symbols", label: "Symbols" },
];

export default function BrowsePage() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [results, setResults] = useState({}); // { label: { loading, error, data } }

    useEffect(() => {
        async function fetchDocs() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch("/api/list-texts");
                if (!res.ok) throw new Error("Failed to fetch documents");
                const data = await res.json();
                setDocs(data.texts || []);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchDocs();
    }, []);

    // Try to load summary from DB for each label
    useEffect(() => {
        if (!docs.length) return;
        docs.forEach((label) => {
            fetch(`/api/ai-summary/${encodeURIComponent(label)}`)
                .then(res => {
                    if (!res.ok) return null;
                    return res.json();
                })
                .then(data => {
                    if (data && data.result) {
                        setResults(prev => ({
                            ...prev,
                            [label]: { loading: false, error: null, data: data.result }
                        }));
                    }
                });
        });
    }, [docs]);

    const handleGenerate = async (label) => {
        setResults((prev) => ({
            ...prev,
            [label]: { loading: true, error: null, data: null },
        }));
        try {
            // Fetch document content
            const docRes = await fetch(`/api/get-text/${encodeURIComponent(label)}`);
            if (!docRes.ok) throw new Error("Failed to fetch document content");
            const docData = await docRes.json();
            // Call summary API (now saves to DB)
            const res = await fetch("/api/ai-complete-summary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: docData.content, label }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Summary failed");
            }
            const data = await res.json();
            setResults((prev) => ({
                ...prev,
                [label]: { loading: false, error: null, data: data.result },
            }));
        } catch (e) {
            setResults((prev) => ({
                ...prev,
                [label]: { loading: false, error: e.message, data: null },
            }));
        }
    };

    return (
        <div className="browse-root">
            <h2>Browse Documents</h2>
            {loading ? (
                <div style={{ textAlign: "center" }}>Loading...</div>
            ) : error ? (
                <div className="browse-error" style={{ textAlign: "center" }}>{error}</div>
            ) : (
                <div className="browse-table-outer">
                    <table className="browse-table">
                        <thead>
                            <tr>
                                <th className="browse-th browse-th-default">Label</th>
                                <th className="browse-th browse-th-default">Generate</th>
                                {SUMMARY_FIELDS.map((f) => (
                                    <th
                                        key={f.key}
                                        className={`browse-th ${f.key === "summary" ? "browse-th-summary" : "browse-th-default"}`}
                                    >
                                        {f.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {docs.map((label) => {
                                const result = results[label] || {};
                                return (
                                    <tr key={label} className="browse-tr">
                                        <td className="browse-td browse-label browse-td-default">{label}</td>
                                        <td className="browse-td browse-td-default">
                                            <button
                                                className="browse-generate-btn"
                                                onClick={() => handleGenerate(label)}
                                                disabled={result.loading}
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, background: 'none', border: 'none' }}
                                            >
                                                <img
                                                    src={chatgptLogo}
                                                    alt="Generate"
                                                    style={{ width: 32, height: 32, opacity: result.loading ? 0.5 : 1 }}
                                                />
                                            </button>
                                            {result.error && (
                                                <div className="browse-error">{result.error}</div>
                                            )}
                                        </td>
                                        {SUMMARY_FIELDS.map((f) => (
                                            <td
                                                key={f.key}
                                                className={`browse-td ${f.key === "summary" ? "browse-td-summary" : "browse-td-default"}`}
                                                style={{ verticalAlign: "top", whiteSpace: "pre-line" }}
                                            >
                                                {result.data ? (
                                                    Array.isArray(result.data[f.key])
                                                        ? result.data[f.key].length > 0
                                                            ? result.data[f.key].join(", ")
                                                            : <span className="browse-empty">—</span>
                                                        : result.data[f.key] || <span className="browse-empty">—</span>
                                                ) : (
                                                    <span className="browse-empty">—</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
