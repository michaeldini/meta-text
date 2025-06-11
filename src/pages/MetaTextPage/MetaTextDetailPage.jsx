import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Box, Alert, Container, Fade, Button } from '@mui/material';
import SourceDocInfo from '../../components/SourceDocInfo';
import Chunks from '../../features/Chunks';
import { useChunkHandlers } from '../../hooks/useChunkHandlers';
import { useMetaTextDetail } from '../../hooks/useMetaTextDetail';
import {
    metaTextDetailContainer,
    metaTextDetailLoadingContainer,
    metaTextDetailLoadingBox,
    metaTextDetailAlert
} from '../../styles/pageStyles';
import log from '../../utils/logger';
import { metaTextReviewRoute } from '../../routes';

export default function MetaTextDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        metaText,
        loading,
        errors,
        sourceDocInfo,
        chunks,
        setChunks,
        refetchSourceDoc,
    } = useMetaTextDetail(id);
    const {
        handleWordClick,
        handleRemoveChunk,
        handleChunkFieldChange,
    } = useChunkHandlers(id, setChunks);

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
    return (
        <Fade in={true} key={id} timeout={750}>
            <Container maxWidth="lg" sx={metaTextDetailContainer}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" gutterBottom>{title || id}</Typography>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(metaTextReviewRoute(id))}
                        sx={{ ml: 2 }}
                    >
                        View Wordlist
                    </Button>
                </Box>
                {errors.sourceDoc ? (
                    <Alert severity="error" sx={metaTextDetailAlert}>{errors.sourceDoc}</Alert>
                ) : sourceDocInfo ? (
                    <SourceDocInfo doc={sourceDocInfo} onInfoUpdate={refetchSourceDoc} />
                ) : null}

                {errors.chunks && (
                    <Alert severity="error" sx={metaTextDetailAlert}>{errors.chunks}</Alert>
                )}

                <Chunks
                    chunks={chunks}
                    handleWordClick={handleWordClick}
                    handleRemoveChunk={(chunkIdx) => handleRemoveChunk(chunkIdx, chunks)}
                    handleChunkFieldChange={handleChunkFieldChange}
                />
            </Container>
        </Fade>
    );
}
