import React from "react";
import "./BrowsePage.css";
import { SUMMARY_FIELDS } from "./constants/summaryFields";
import { useSourceDocuments } from "./hooks/useSourceDocuments";
import { useSummariesForDocs } from "./hooks/useSummariesForDocs";
import { generateAiSummary } from "./services/sourceDocumentService";
import ErrorMessage from "./components/ErrorMessage";
import DocumentSummaryTable from "./components/DocumentSummaryTable";

export default function BrowsePage() {
    const { docs, loading, error } = useSourceDocuments();
    const [results, setResults] = useSummariesForDocs(docs);

    const handleGenerate = async (label) => {
        setResults((prev) => ({
            ...prev,
            [label]: { loading: true, error: null, data: null },
        }));
        try {
            // Fetch document content
            const res = await fetch(`/api/source-documents/${encodeURIComponent(label)}`);
            if (!res.ok) throw new Error("Failed to fetch document content");
            const docData = await res.json();
            // Generate summary
            const data = await generateAiSummary(label, docData.content);
            setResults((prev) => ({
                ...prev,
                [label]: { loading: false, error: null, data },
            }));
        } catch (e) {
            setResults((prev) => ({
                ...prev,
                [label]: { loading: false, error: e.message, data: null },
            }));
        }
    };

    return (
        <div className="browse-root">
            <h2>Browse Documents</h2>
            {loading ? (
                <div style={{ textAlign: "center" }}>Loading...</div>
            ) : error ? (
                <ErrorMessage>{error}</ErrorMessage>
            ) : (
                <DocumentSummaryTable docs={docs} results={results} onGenerate={handleGenerate} />
            )}
        </div>
    );
}
