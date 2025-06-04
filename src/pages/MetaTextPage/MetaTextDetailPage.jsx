import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMetaText } from '../../services/metaTextService';
import { Typography, CircularProgress, Box, Alert, Container } from '@mui/material';
import SourceDocInfo from '../../components/SourceDocInfo';
import { fetchSourceDocument } from '../../services/sourceDocumentService';
import Chunks from '../../features/Chunks';
import { useChunkHandlers } from '../../hooks/useChunkHandlers';

export default function MetaTextDetailPage() {
    const { id } = useParams();
    const [metaText, setMetaText] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sourceDoc, setSourceDoc] = useState(null);
    const [sourceDocLoading, setSourceDocLoading] = useState(false);
    const [sourceDocError, setSourceDocError] = useState('');
    const [chunks, setChunks] = useState([]);
    const {
        handleWordClick,
        handleRemoveChunk,
        handleChunkFieldChange
    } = useChunkHandlers(id, setChunks);

    useEffect(() => {
        setLoading(true);
        setError('');
        fetchMetaText(id)
            .then(data => {
                setMetaText(data);
                // Convert backend chunks (array of strings or objects) to chunk objects
                const initialChunks = (data.chunks || []).map((chunk, idx) =>
                    typeof chunk === 'object'
                        ? { ...chunk, content: chunk.text }
                        : { id: idx, content: chunk }
                );
                setChunks(initialChunks);
                // Chunks are now provided by the backend as an array of strings in data.chunks
                // Fetch source document if possible
                if (data.source_document_id) {
                    setSourceDocLoading(true);
                    setSourceDocError('');
                    fetchSourceDocument(data.source_document_id)
                        .then(doc => setSourceDoc(doc))
                        .catch(e => setSourceDocError(e.message || 'Failed to load source document.'))
                        .finally(() => setSourceDocLoading(false));
                } else {
                    setSourceDoc(null);
                }
            })
            .catch(e => setError(e.message || 'Failed to load meta text.'))
            .finally(() => setLoading(false));
    }, [id]);

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
    if (error) {
        return (
            <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
                <Typography variant="h4" gutterBottom>Meta Text</Typography>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            <Typography variant="h4" gutterBottom>{metaText?.title || id}</Typography>
            {sourceDocLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CircularProgress size={20} sx={{ mr: 2 }} />
                    <Typography variant="body2">Loading source document...</Typography>
                </Box>
            ) : sourceDocError ? (
                <Alert severity="error" sx={{ mb: 2 }}>{sourceDocError}</Alert>
            ) : sourceDoc ? (
                <SourceDocInfo doc={sourceDoc} />
            ) : null}
            <Chunks
                chunks={chunks}
                handleWordClick={handleWordClick}
                handleRemoveSection={(chunkIdx) => handleRemoveChunk(chunkIdx, chunks)}
                handleSectionFieldChange={handleChunkFieldChange}
            />
        </Container>
    );
}
