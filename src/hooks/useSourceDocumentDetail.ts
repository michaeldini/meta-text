import { useState, useEffect } from "react";
import { fetchSourceDocument } from "../services/sourceDocumentService";
import type { SourceDocument } from '../types/sourceDocument';

/**
 * Fetch a single source document by ID.
 * @param id - The document ID (string, required).
 * @returns {{ doc: SourceDocument|null, loading: boolean, error: string, setDoc: function, refetch: function }}
 */
export function useSourceDocumentDetail(id: string) {
    const [doc, setDoc] = useState<SourceDocument | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [refreshIndex, setRefreshIndex] = useState(0);
    const refetch = () => setRefreshIndex(i => i + 1);

    useEffect(() => {
        setLoading(true);
        setError("");
        fetchSourceDocument(id)
            .then(data => setDoc(data))
            .catch(e => {
                setDoc(null);
                setError(e.message || "Failed to load document.");
            })
            .finally(() => setLoading(false));
    }, [id, refreshIndex]);

    return { doc, loading, error, setDoc, refetch };
}
