import React from "react";
import { useNavigate } from "react-router-dom";
import "./BrowsePage.css";
import { useSourceDocuments } from "../../hooks/useSourceDocuments";
import { useSummariesForDocs } from "../../hooks/useSummariesForDocs";
import ErrorMessage from "../../components/ErrorMessage";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { SUMMARY_FIELDS } from "../../constants/summaryFields";

export default function BrowsePage() {
    const { docs, loading, error } = useSourceDocuments();
    const [results, setResults] = useSummariesForDocs(docs);
    const [loadingLabel, setLoadingLabel] = React.useState(null);
    const [errorLabel, setErrorLabel] = React.useState(null);
    const navigate = useNavigate();

    const handleCardClick = (label) => {
        navigate(`/documents/${encodeURIComponent(label)}`);
    };

    const handleGenerateSummary = async (label) => {
        setLoadingLabel(label);
        setErrorLabel(null);
        try {
            // Fetch the document content for the prompt
            const docRes = await fetch(`/api/source-documents/${encodeURIComponent(label)}`);
            if (!docRes.ok) throw new Error("Failed to fetch document");
            const docData = await docRes.json();
            const prompt = docData.content;
            // Call the complete_summary endpoint
            const res = await fetch("/api/ai-complete-summary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, label }),
            });
            if (!res.ok) throw new Error("Failed to generate summary");
            const data = await res.json();
            setResults((prev) => ({
                ...prev,
                [label]: { data: data.result }
            }));
        } catch (e) {
            setErrorLabel(label);
        } finally {
            setLoadingLabel(null);
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
                <Grid container spacing={3}>
                    {docs.map((label) => {
                        const result = results[label]?.data || {};
                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={label}>
                                <Card sx={{ backgroundColor: '#23272f', color: '#fff', boxShadow: 3 }}>
                                    <CardActionArea onClick={() => handleCardClick(label)}>
                                        {/* Placeholder for image */}
                                        <CardContent sx={{ backgroundColor: '#23272f', color: '#fff' }}>
                                            <Typography variant="h6" component="div" gutterBottom sx={{ color: '#fff' }}>
                                                {label}
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                sx={{ mb: 2, mt: 1 }}
                                                onClick={e => { e.stopPropagation(); handleGenerateSummary(label); }}
                                                disabled={loadingLabel === label}
                                            >
                                                {loadingLabel === label ? <CircularProgress size={20} color="inherit" /> : "Generate Summary"}
                                            </Button>
                                            {errorLabel === label && (
                                                <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                                                    Error generating summary
                                                </Typography>
                                            )}
                                            {SUMMARY_FIELDS.map((f) => (
                                                <Typography key={f.key} variant="body2" sx={{ color: '#b0b0b0', mb: 0.5 }}>
                                                    <strong>{f.label}:</strong>{' '}
                                                    {result && result[f.key] ? (
                                                        Array.isArray(result[f.key])
                                                            ? result[f.key].length > 0
                                                                ? result[f.key].join(", ")
                                                                : "—"
                                                            : result[f.key]
                                                    ) : "—"}
                                                </Typography>
                                            ))}
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </div>
    );
}
