import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DocumentListPage() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchDocs() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch("/api/meta-text");
                if (!res.ok) throw new Error("Failed to fetch documents");
                const data = await res.json();
                setDocs(data.meta_texts || []);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchDocs();
    }, []);

    if (loading) return <div style={{ textAlign: 'center' }}>Loading...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', minHeight: '100vh', width: '100%' }}>
            <h2 style={{ marginBottom: '2rem' }}>Choose a Meta-Text</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', width: '100%', maxWidth: 900 }}>
                {docs.map((name) => (
                    <button
                        key={name}
                        style={{ fontSize: '1.1rem', padding: '0.5rem 1.5rem', borderRadius: 8, border: '1px solid #ddd', cursor: 'pointer', minWidth: 200, maxWidth: 320, margin: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                        onClick={() => navigate(`/viewer/${encodeURIComponent(name)}`)}
                    >
                        {name}
                    </button>
                ))}
            </div>
        </div>
    );
}
