import { useEffect, useState } from "react";
import { fetchAiSummary } from "../services/sourceDocumentService";

export function useSummariesForDocs(docs) {
    const [results, setResults] = useState({}); // { title: { loading, error, data } }

    useEffect(() => {
        if (!docs.length) return;
        docs.forEach(async (title) => {
            setResults(prev => ({ ...prev, [title]: { loading: true, error: null, data: null } }));
            try {
                const data = await fetchAiSummary(title);
                setResults(prev => ({ ...prev, [title]: { loading: false, error: null, data } }));
            } catch (e) {
                setResults(prev => ({ ...prev, [title]: { loading: false, error: e.message, data: null } }));
            }
        });
    }, [docs]);

    return [results, setResults];
}
