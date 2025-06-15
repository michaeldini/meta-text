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
    const { id } = useParams();
    const { doc, loading, error, refetch } = useSourceDocument(id);

    React.useEffect(() => {
        log.info('SourceDocDetailPage mounted');
        return () => log.info('SourceDocDetailPage unmounted');
    }, []);

    let renderDocContent;
    renderDocContent = (
        <ErrorBoundary>
            <LoadingBoundary loading={loading}>
                {error ? (
                    <Typography color="error">{error}</Typography>
                ) : doc ? (
                    <Paper sx={sourceDocDetailPaper}>
                        <Typography variant="body1" style={sourceDocDetailText}>
                            {doc.text}
                        </Typography>
                    </Paper>
                ) : null}
            </LoadingBoundary>
        </ErrorBoundary>
    );

    return (
        <Box sx={sourceDocDetailContainer}>
            <Typography variant="h4" gutterBottom>{doc?.title}</Typography>
            {doc && (
                <SourceDocInfo
                    doc={doc}
                    onInfoUpdate={refetch}
                />
            )}
            {renderDocContent}
        </Box>
    );
}
