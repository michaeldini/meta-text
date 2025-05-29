import { useEffect, useState } from "react";
import { fetchSourceDocuments } from "../services/sourceDocumentService";

export function useSourceDocuments() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadDocs() {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchSourceDocuments();
                setDocs(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        loadDocs();
    }, []);

    return { docs, loading, error };
}
