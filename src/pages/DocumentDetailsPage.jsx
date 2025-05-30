import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

export default function DocumentDetailsPage() {
    const { label } = useParams();
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchDoc() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/source-documents/${encodeURIComponent(label)}`);
                if (!res.ok) throw new Error("Failed to fetch document");
                const data = await res.json();
                setDoc(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchDoc();
    }, [label]);

    return (
        <div style={{ maxWidth: 700, margin: "2rem auto" }}>
            {loading ? (
                <div style={{ textAlign: "center" }}><CircularProgress /></div>
            ) : error ? (
                <ErrorMessage>{error}</ErrorMessage>
            ) : doc ? (
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>{doc.label}</Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            <strong>Full Text:</strong>
                        </Typography>
                        <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
                            {doc.content}
                        </Typography>
                    </CardContent>
                </Card>
            ) : null}
        </div>
    );
}
