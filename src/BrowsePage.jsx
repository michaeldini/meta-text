import React, { useEffect, useState } from "react";

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
        <div style={{ maxWidth: 1100, margin: "2rem auto", padding: "2rem", borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.07)", background: "#181818", color: "#fff" }}>
            <h2>Browse Documents</h2>
            {loading ? (
                <div style={{ textAlign: "center" }}>Loading...</div>
            ) : error ? (
                <div style={{ color: "#ff6b6b", textAlign: "center" }}>{error}</div>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, background: "#23234a", borderRadius: 12, boxShadow: "0 2px 8px #4747c1" }}>
                        <thead>
                            <tr>
                                <th style={{ padding: "1rem", textAlign: "left" }}>Label</th>
                                <th style={{ padding: "1rem", textAlign: "left" }}>Generate</th>
                                {SUMMARY_FIELDS.map((f) => (
                                    <th
                                        key={f.key}
                                        style={{
                                            padding: "1rem",
                                            textAlign: "left",
                                            minWidth: f.key === "summary" ? 320 : 120,
                                            maxWidth: f.key === "summary" ? 600 : 220,
                                            width: f.key === "summary" ? 400 : 180,
                                        }}
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
                                    <tr key={label} style={{ background: "#23234a", borderBottom: "1px solid #333" }}>
                                        <td style={{ padding: "1rem", fontWeight: 600 }}>{label}</td>
                                        <td style={{ padding: "1rem" }}>
                                            <button
                                                onClick={() => handleGenerate(label)}
                                                disabled={result.loading}
                                                style={{ minWidth: 110 }}
                                            >
                                                {result.loading ? "Generating..." : "Generate"}
                                            </button>
                                            {result.error && (
                                                <div style={{ color: "#ff6b6b", marginTop: 6, fontSize: 13 }}>{result.error}</div>
                                            )}
                                        </td>
                                        {SUMMARY_FIELDS.map((f) => (
                                            <td
                                                key={f.key}
                                                style={{
                                                    padding: "1rem",
                                                    verticalAlign: "top",
                                                    whiteSpace: "pre-line",
                                                    maxWidth: f.key === "summary" ? 600 : 220,
                                                    minWidth: f.key === "summary" ? 320 : 120,
                                                    width: f.key === "summary" ? 400 : 180,
                                                }}
                                            >
                                                {result.data ? (
                                                    Array.isArray(result.data[f.key])
                                                        ? result.data[f.key].length > 0
                                                            ? result.data[f.key].join(", ")
                                                            : <span style={{ color: "#bbb" }}>—</span>
                                                        : result.data[f.key] || <span style={{ color: "#bbb" }}>—</span>
                                                ) : (
                                                    <span style={{ color: "#bbb" }}>—</span>
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
