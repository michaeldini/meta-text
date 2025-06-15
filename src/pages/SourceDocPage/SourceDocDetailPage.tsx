import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Paper, Typography, Box, Alert, Button, Breadcrumbs } from '@mui/material';
import SourceDocInfo from '../../components/SourceDocInfo';
import { useSourceDocumentDetail } from '../../hooks/useSourceDocumentDetail';
import {
    sourceDocDetailContainer,
    sourceDocDetailPaper,
    sourceDocDetailText
} from '../../styles/pageStyles';
import log from '../../utils/logger';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingBoundary from '../../components/LoadingBoundary';
import type { SourceDocument } from '../../types/sourceDocument';

export default function SourceDocDetailPage() {
    const { sourceDocId } = useParams<{ sourceDocId?: string }>();

    // Only call the hook if sourceDocId is defined, otherwise provide a stub error state
    const hookResult = sourceDocId ? useSourceDocumentDetail(sourceDocId) : { doc: null, loading: false, error: 'No document ID provided.', refetch: () => { } };
    const { doc, loading, error, refetch } = hookResult;

    React.useEffect(() => {
        log.info('SourceDocDetailPage mounted');
        return () => log.info('SourceDocDetailPage unmounted');
    }, []);

    return (
        <Box sx={sourceDocDetailContainer}>
            {/* Breadcrumbs for navigation */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
                <Link to="/sourceDocs" style={{ textDecoration: 'none', color: 'inherit' }}>Source Documents</Link>
                <Typography color="text.primary">Details</Typography>
            </Breadcrumbs>
            <ErrorBoundary>
                <LoadingBoundary loading={loading}>
                    {/* Show error if present */}
                    {error ? (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                            <Button onClick={refetch} size="small" sx={{ ml: 2 }} variant="outlined">Retry</Button>
                        </Alert>
                    ) : doc ? (
                        <>
                            <Typography variant="h4" gutterBottom>{doc.title}</Typography>
                            <SourceDocInfo doc={doc as SourceDocument} onInfoUpdate={refetch} />
                            <Paper sx={sourceDocDetailPaper}>
                                <Typography variant="body1" sx={sourceDocDetailText} aria-label="Document Text">
                                    {doc.text}
                                </Typography>
                            </Paper>
                            <Button onClick={refetch} variant="contained" sx={{ mt: 2 }}>Refresh</Button>
                        </>
                    ) : (
                        <Alert severity="info">Document not found.</Alert>
                    )}
                </LoadingBoundary>
            </ErrorBoundary>
        </Box>
    );
}
