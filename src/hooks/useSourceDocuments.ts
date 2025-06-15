import { useState, useEffect, useCallback } from "react";
import { fetchSourceDocuments } from "../services/sourceDocumentService";
import type { SourceDocument } from '../types/sourceDocument';

export function useSourceDocuments(deps: any[] = []) {
    const [sourceDocs, setSourceDocs] = useState<SourceDocument[]>([]);
    const [sourceDocsLoading, setSourceDocsLoading] = useState(true);
    const [sourceDocsError, setSourceDocsError] = useState("");
    const [refreshIndex, setRefreshIndex] = useState(0);

    const refresh = useCallback(() => setRefreshIndex(i => i + 1), []);

    useEffect(() => {
        setSourceDocsLoading(true);
        setSourceDocsError("");
        fetchSourceDocuments()
            .then((docs: SourceDocument[]) => setSourceDocs(docs))
            .catch(e => setSourceDocsError(e.message))
            .finally(() => setSourceDocsLoading(false));
    }, [...deps, refreshIndex]); // eslint-disable-line react-hooks/exhaustive-deps

    return { sourceDocs, sourceDocsLoading, sourceDocsError, refresh };
}
