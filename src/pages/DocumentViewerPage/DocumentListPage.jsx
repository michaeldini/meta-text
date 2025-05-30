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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', minHeight: '100vh' }}>
            <h2 style={{ marginBottom: '2rem' }}>Choose a Meta-Text</h2>
            <ul style={{ listStyle: 'none', padding: 0, width: '100%', maxWidth: 480 }}>
                {docs.map((name) => (
                    <li key={name} style={{ margin: '1rem 0', display: 'flex', justifyContent: 'center' }}>
                        <button
                            style={{ fontSize: '1.1rem', padding: '0.5rem 1.5rem', borderRadius: 8, border: '1px solid #ddd', cursor: 'pointer', width: '100%', maxWidth: 320 }}
                            onClick={() => navigate(`/viewer/${encodeURIComponent(name)}`)}
                        >
                            {name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
