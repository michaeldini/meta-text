import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMetaText } from '../../services/metaTextService';
import { Typography, CircularProgress, Box, Alert, Container, Fade } from '@mui/material';
import SourceDocInfo from '../../components/SourceDocInfo';
import { fetchSourceDocumentInfo } from '../../services/sourceDocumentService';
import { fetchChunks } from '../../services/chunkService';
import AutoSaveControl from '../../components/AutoSaveControl';
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
        handleChunkFieldChange,
        saveAll
    } = useChunkHandlers(id, setChunks);

    useEffect(() => {
        setLoading(true);
        setError('');
        fetchMetaText(id)
            .then(data => {
                setMetaText(data);
                if (data.source_document_id) {
                    setSourceDocLoading(true);
                    setSourceDocError('');
                    fetchSourceDocumentInfo(data.source_document_id)
                        .then(doc => setSourceDoc(doc))
                        .catch(e => setSourceDocError(e.message || 'Failed to load source document.'))
                        .finally(() => setSourceDocLoading(false));
                    fetchChunks(data.id)
                        .then(data => {
                            setChunks(data.map(chunk => ({
                                ...chunk,
                                content: chunk.text // Ensure content is available for Chunks component
                            })));
                        })
                        .catch(e => setError(e.message || 'Failed to load chunks.'));
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
        <Fade in={true} key={id} timeout={750}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                    <AutoSaveControl
                        value={chunks}
                        delay={1000 * 60 * 2} // 2 minutes
                        onSave={async () => {
                            await saveAll(chunks);
                        }}
                        deps={[id, chunks]}
                    />
                </Box>
                <Chunks
                    chunks={chunks}
                    handleWordClick={handleWordClick}
                    handleRemoveSection={(chunkIdx) => handleRemoveChunk(chunkIdx, chunks)}
                    handleSectionFieldChange={handleChunkFieldChange}
                />
            </Container>
        </Fade>
    );
}
