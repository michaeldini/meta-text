import { useState, useEffect } from "react";
import { fetchSourceDocument } from "../services/sourceDocumentService";

/**
 * Fetch a single source document by ID.
 * @param {string|number} id - The document ID.
 * @returns {{ doc: object|null, loading: boolean, error: string, setDoc: function }}
 */
export function useSourceDocument(id) {
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (id === undefined || id === null) {
            setError("No document ID provided.");
            setLoading(false);
            setDoc(null);
            return;
        }
        setLoading(true);
        setError("");
        if (isNaN(id)) {
            setError("Invalid document ID.");
            setLoading(false);
            setDoc(null);
            return;
        }
        fetchSourceDocument(id)
            .then(data => setDoc(data))
            .catch(e => setError(e.message || "Failed to load document."))
            .finally(() => setLoading(false));
    }, [id]);

    return { doc, loading, error, setDoc };
}
