import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, Box, Alert, Container, Fade } from '@mui/material';
import SourceDocInfo from '../../components/SourceDocInfo';
import Chunks from '../../features/Chunks';
import { useChunkHandlers } from '../../hooks/useChunkHandlers';
import { useMetaTextDetail } from '../../hooks/useMetaTextDetail';

export default function MetaTextDetailPage() {
    const { id } = useParams();
    const {
        metaText,
        loading,
        errors,
        sourceDoc,
        chunks,
        setChunks,
        setSourceDoc, // Add setSourceDoc from useMetaTextDetail
    } = useMetaTextDetail(id);
    const {
        handleWordClick,
        handleRemoveChunk,
        handleChunkFieldChange,
    } = useChunkHandlers(id, setChunks);

    // Destructure metaText fields early for clarity
    const title = metaText?.title;

    // Handler to update sourceDoc fields from AI info
    const handleSourceDocInfoUpdate = aiInfo => {
        if (setSourceDoc) {
            setSourceDoc(prev => ({ ...prev, ...aiInfo }));
        }
    };

    if (loading) {
        return (
            <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Box>
        );
    }
    if (errors.metaText) {
        return (
            <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
                <Alert severity="error">{errors.metaText}</Alert>
            </Box>
        );
    }
    return (
        <Fade in={true} key={id} timeout={750}>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
                <Typography variant="h4" gutterBottom>{title || id}</Typography>
                {errors.sourceDoc ? (
                    <Alert severity="error" sx={{ mb: 2 }}>{errors.sourceDoc}</Alert>
                ) : sourceDoc ? (
                    <SourceDocInfo doc={sourceDoc} onInfoUpdate={handleSourceDocInfoUpdate} />
                ) : null}

                {errors.chunks && (
                    <Alert severity="error" sx={{ mb: 2 }}>{errors.chunks}</Alert>
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
