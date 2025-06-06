import { useState, useEffect, useCallback } from "react";
import { fetchSourceDocument } from "../services/sourceDocumentService";

export function useSourceDocument(id) {
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshIndex, setRefreshIndex] = useState(0);

    const refresh = useCallback(() => setRefreshIndex(i => i + 1), []);

    useEffect(() => {
        setLoading(true);
        setError("");
        const docId = parseInt(id, 10);
        if (isNaN(docId)) {
            setError("Invalid document ID.");
            setLoading(false);
            setDoc(null);
            return;
        }
        fetchSourceDocument(docId)
            .then(data => setDoc(data))
            .catch(e => setError(e.message || "Failed to load document."))
            .finally(() => setLoading(false));
    }, [id, refreshIndex]);

    return { doc, loading, error, refresh, setDoc };
}
