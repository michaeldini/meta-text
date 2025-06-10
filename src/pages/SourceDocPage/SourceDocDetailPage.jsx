import React from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import SourceDocInfo from '../../components/SourceDocInfo';
import { useSourceDocument } from '../../hooks/useSourceDocument';
import {
    sourceDocDetailContainer,
    sourceDocDetailLoading,
    sourceDocDetailPaper,
    sourceDocDetailText
} from '../../styles/pageStyles';
import log from '../../utils/logger';

export default function SourceDocDetailPage() {
    const { id } = useParams();
    const { doc, loading, error, refetch } = useSourceDocument(id);

    React.useEffect(() => {
        log.info('SourceDocDetailPage mounted');
        return () => log.info('SourceDocDetailPage unmounted');
    }, []);

    return (
        <Box sx={sourceDocDetailContainer}>
            <Typography variant="h4" gutterBottom>{doc?.title}</Typography>
            {doc && (
                <SourceDocInfo
                    doc={doc}
                    onInfoUpdate={refetch}
                />
            )}
            {loading ? (
                <Box sx={sourceDocDetailLoading}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : doc ? (
                <Paper sx={sourceDocDetailPaper}>
                    <Typography variant="body1" style={sourceDocDetailText}>
                        {doc.text}
                    </Typography>
                </Paper>
            ) : null}
        </Box>
    );
}
