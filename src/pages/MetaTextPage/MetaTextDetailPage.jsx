import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Box, Alert, Button, Paper } from '@mui/material';
import SourceDocInfo from '../../components/SourceDocInfo';
import Chunks from '../../features/Chunks';
import { useMetaTextDetail } from '../../hooks/useMetaTextDetail';
import {
    metaTextDetailLoadingContainer,
    metaTextDetailLoadingBox,
    metaTextDetailAlert,
    metaTextDetailPaper // <-- import the Paper style
} from '../../styles/pageStyles';
import log from '../../utils/logger';
import { metaTextReviewRoute } from '../../routes';
import PageContainer from '../../components/PageContainer';
import ErrorBoundary from '../../components/ErrorBoundary';
import LoadingBoundary from '../../components/LoadingBoundary';


export default function MetaTextDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        metaText,
        loading,
        errors,
        sourceDocInfo,
        refetchSourceDoc,
    } = useMetaTextDetail(id);

    // Destructure metaText fields early for clarity
    const title = metaText?.title;

    React.useEffect(() => {
        log.info('MetaTextDetailPage mounted');
        return () => log.info('MetaTextDetailPage unmounted');
    }, []);

    if (loading) {
        return (
            <LoadingBoundary loading={loading}>
                {/* This will never render children while loading, but keeps the pattern consistent */}
            </LoadingBoundary>
        );
    }
    if (errors.metaText) {
        return (
            <ErrorBoundary>
                <Box sx={metaTextDetailLoadingContainer}>
                    <Alert severity="error">{errors.metaText}</Alert>
                </Box>
            </ErrorBoundary>
        );
    }

    const sourceDocSection = (
        errors.sourceDoc ? (
            <ErrorBoundary>
                <Alert severity="error" sx={metaTextDetailAlert}>{errors.sourceDoc}</Alert>
            </ErrorBoundary>
        ) : sourceDocInfo ? (
            <SourceDocInfo doc={sourceDocInfo} onInfoUpdate={refetchSourceDoc} />
        ) : null
    );
    const chunksErrorSection = errors.chunks && (
        <ErrorBoundary>
            <Alert severity="error" sx={metaTextDetailAlert}>{errors.chunks}</Alert>
        </ErrorBoundary>
    );

    return (
        <PageContainer>
            <Paper sx={metaTextDetailPaper} elevation={3}>
                <Typography variant="body1">
                    Meta Text Title: {title || id}
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(metaTextReviewRoute(id))}
                >
                    Review
                </Button>
            </Paper>
            {sourceDocSection}
            {chunksErrorSection}
            {id && (
                <Chunks metaTextId={id} />
            )}
        </PageContainer>
    );
}