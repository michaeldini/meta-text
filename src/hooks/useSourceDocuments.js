import { useState, useEffect, useCallback } from "react";
import { fetchSourceDocuments } from "../services/sourceDocumentService";

export function useSourceDocuments(deps = []) {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshIndex, setRefreshIndex] = useState(0);

    const refresh = useCallback(() => setRefreshIndex(i => i + 1), []);

    useEffect(() => {
        setLoading(true);
        setError("");
        fetchSourceDocuments()
            .then(docs => setDocs(docs))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [...deps, refreshIndex]); // eslint-disable-line react-hooks/exhaustive-deps

    return { docs, loading, error, refresh };
}
