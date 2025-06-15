import { useState, useEffect } from "react";
import { fetchSourceDocument } from "../services/sourceDocumentService";
import type { SourceDocument } from '../types/sourceDocument';

/**
 * Fetch a single source document by ID.
 * @param id - The document ID.
 * @returns {{ doc: SourceDocument|null, loading: boolean, error: string, setDoc: function, refetch: function }}
 */
export function useSourceDocumentDetail(id: string | number) {
    const [doc, setDoc] = useState<SourceDocument | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Add a refreshIndex to trigger refetch
    const [refreshIndex, setRefreshIndex] = useState(0);
    const refetch = () => setRefreshIndex(i => i + 1);

    useEffect(() => {
        if (id === undefined || id === null) {
            setError("No document ID provided.");
            setLoading(false);
            setDoc(null);
            return;
        }
        setLoading(true);
        setError("");
        const docId = typeof id === 'string' ? parseInt(id, 10) : id;
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

    return { doc, loading, error, setDoc, refetch };
}
