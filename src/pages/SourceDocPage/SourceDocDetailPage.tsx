import React from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography, Box } from '@mui/material';
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
    // Convert sourceDocId to number if present, otherwise undefined
    const docId = sourceDocId ? parseInt(sourceDocId, 10) : undefined;
    // Only call the hook if docId is defined
    const { doc, loading, refetch } = useSourceDocumentDetail(docId as number);

    React.useEffect(() => {
        log.info('SourceDocDetailPage mounted');
        return () => log.info('SourceDocDetailPage unmounted');
    }, []);

    return (
        <Box sx={sourceDocDetailContainer}>
            <ErrorBoundary>
                <LoadingBoundary loading={loading}>
                    {/* Only render if doc exists */}
                    {doc ? (
                        <>
                            <Typography variant="h4" gutterBottom>{doc.title}</Typography>
                            <SourceDocInfo doc={doc as SourceDocument} onInfoUpdate={refetch} />
                            <Paper sx={sourceDocDetailPaper}>
                                <Typography variant="body1" style={sourceDocDetailText}>
                                    {doc.text}
                                </Typography>
                            </Paper>
                        </>
                    ) : null}
                </LoadingBoundary>
            </ErrorBoundary>
        </Box>
    );
}
