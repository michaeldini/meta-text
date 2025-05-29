import { useEffect, useState } from "react";
import { fetchAiSummary } from "../services/sourceDocumentService";

export function useSummariesForDocs(docs) {
    const [results, setResults] = useState({}); // { label: { loading, error, data } }

    useEffect(() => {
        if (!docs.length) return;
        docs.forEach(async (label) => {
            setResults(prev => ({ ...prev, [label]: { loading: true, error: null, data: null } }));
            try {
                const data = await fetchAiSummary(label);
                setResults(prev => ({ ...prev, [label]: { loading: false, error: null, data } }));
            } catch (e) {
                setResults(prev => ({ ...prev, [label]: { loading: false, error: e.message, data: null } }));
            }
        });
    }, [docs]);

    return [results, setResults];
}
