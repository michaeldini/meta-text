import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMetaText } from '../../services/metaTextService';
import { Typography, CircularProgress, Box, Alert, Container, Fade } from '@mui/material';
import SourceDocInfo from '../../components/SourceDocInfo';
import { fetchSourceDocumentInfo } from '../../services/sourceDocumentService';
import { fetchChunks } from '../../services/chunkService';
import Chunks from '../../features/Chunks';
import { useChunkHandlers } from '../../hooks/useChunkHandlers';

export default function MetaTextDetailPage() {
    const { id } = useParams();
    const [metaText, setMetaText] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({ metaText: '', sourceDoc: '' });
    const [sourceDoc, setSourceDoc] = useState(null);
    const [chunks, setChunks] = useState([]);
    const {
        handleWordClick,
        handleRemoveChunk,
        handleChunkFieldChange,
    } = useChunkHandlers(id, setChunks);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setErrors({ metaText: '', sourceDoc: '' });
        setMetaText(null);
        setSourceDoc(null);
        setChunks([]);
        fetchMetaText(id)
            .then(async data => {
                if (!isMounted) return;
                setMetaText(data);
                if (data.source_document_id) {
                    try {
                        const [doc, chunkData] = await Promise.all([
                            fetchSourceDocumentInfo(data.source_document_id),
                            fetchChunks(data.id)
                        ]);
                        if (!isMounted) return;
                        setSourceDoc(doc);
                        setChunks(chunkData.map(chunk => ({
                            ...chunk,
                            content: chunk.text
                        })));
                    } catch (e) {
                        if (!isMounted) return;
                        setErrors(prev => ({ ...prev, sourceDoc: e.message || 'Failed to load source document or chunks.' }));
                    }
                }
            })
            .catch(e => {
                if (!isMounted) return;
                setErrors(prev => ({ ...prev, metaText: e.message || 'Failed to load meta text.' }));
            })
            .finally(() => {
                if (!isMounted) return;
                setLoading(false);
            });
        return () => { isMounted = false; };
    }, [id]);

    // Destructure metaText fields early for clarity
    const title = metaText?.title;

    if (loading) {
        return (
            <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
                <Typography variant="h4" gutterBottom>Meta Text</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Box>
        );
    }
    if (errors.metaText) {
        return (
            <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
                <Typography variant="h4" gutterBottom>Meta Text</Typography>
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
                    <SourceDocInfo doc={sourceDoc} />
                ) : null}

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
