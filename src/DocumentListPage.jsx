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
                const res = await fetch("/api/list-split-documents");
                if (!res.ok) throw new Error("Failed to fetch documents");
                const data = await res.json();
                setDocs(data.split_documents || []);
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
        <div style={{ maxWidth: 600, margin: '2rem auto', padding: '2rem', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
            <h2>Choose a Document</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {docs.map((name) => (
                    <li key={name} style={{ margin: '1rem 0' }}>
                        <button
                            style={{ fontSize: '1.1rem', padding: '0.5rem 1.5rem', borderRadius: 8, border: '1px solid #ddd', cursor: 'pointer' }}
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
