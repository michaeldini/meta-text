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
    const [sourceDocError, setSourceDocError] = useState('');
    const [chunks, setChunks] = useState([]);
    const {
        handleWordClick,
        handleRemoveChunk,
        handleChunkFieldChange,
        saveAll
    } = useChunkHandlers(id, setChunks);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError('');
        setSourceDocError('');
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
                        setSourceDocError(e.message || 'Failed to load source document or chunks.');
                    }
                }
            })
            .catch(e => {
                if (!isMounted) return;
                setError(e.message || 'Failed to load meta text.');
            })
            .finally(() => {
                if (!isMounted) return;
                setLoading(false);
            });
        return () => { isMounted = false; };
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
                {sourceDocError ? (
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
