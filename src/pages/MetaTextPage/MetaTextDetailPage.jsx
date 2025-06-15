import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Box, Alert, Button, Paper } from '@mui/material';
import SourceDocInfo from '../../components/SourceDocInfo';
import Chunks from '../../features/Chunks';
import { useMetaTextDetail } from '../../hooks/useMetaTextDetail';
import {
    metaTextDetailLoadingContainer,
    metaTextDetailLoadingBox,
    metaTextDetailAlert
} from '../../styles/pageStyles';
import log from '../../utils/logger';
import { metaTextReviewRoute } from '../../routes';
import PageContainer from '../../components/PageContainer';
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
            <Box sx={metaTextDetailLoadingContainer}>
                <Box sx={metaTextDetailLoadingBox}>
                    <CircularProgress />
                </Box>
            </Box>
        );
    }
    if (errors.metaText) {
        return (
            <Box sx={metaTextDetailLoadingContainer}>
                <Alert severity="error">{errors.metaText}</Alert>
            </Box>
        );
    }

    const sourceDocSection = (
        errors.sourceDoc ? (
            <Alert severity="error" sx={metaTextDetailAlert}>{errors.sourceDoc}</Alert>
        ) : sourceDocInfo ? (
            <SourceDocInfo doc={sourceDocInfo} onInfoUpdate={refetchSourceDoc} />
        ) : null
    );
    const chunksErrorSection = errors.chunks && (
        <Alert severity="error" sx={metaTextDetailAlert}>{errors.chunks}</Alert>
    );

    return (
        <PageContainer>
            <Paper sx={{ display: 'flex', alignItems: 'baseline', p: 2, mb: 2, gap: 2 }} elevation={3}>
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