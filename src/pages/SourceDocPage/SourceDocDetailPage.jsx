import React from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography, Box } from '@mui/material';
import SourceDocInfo from '../../components/SourceDocInfo';
import { useSourceDocument } from '../../hooks/useSourceDocument';
import {
    sourceDocDetailContainer,
    sourceDocDetailPaper,
    sourceDocDetailText
} from '../../styles/pageStyles';
import log from '../../utils/logger';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingBoundary from '../../components/LoadingBoundary';

export default function SourceDocDetailPage() {
    const { sourceDocId } = useParams();
    const { doc, loading, refetch } = useSourceDocument(sourceDocId);

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
                            <SourceDocInfo doc={doc} onInfoUpdate={refetch} />
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
