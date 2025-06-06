import { useEffect, useState } from 'react';
import { fetchMetaText } from '../services/metaTextService';
import { fetchSourceDocument } from '../services/sourceDocumentService';
import { fetchChunks } from '../services/chunkService';

export function useMetaTextDetail(id) {
    const [metaText, setMetaText] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({ metaText: '', sourceDoc: '', chunks: '' });
    const [sourceDocInfo, setSourceDocInfo] = useState(null);
    const [chunks, setChunks] = useState([]);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setErrors({ metaText: '', sourceDoc: '', chunks: '' });
        setMetaText(null);
        setSourceDocInfo(null);
        setChunks([]);
        fetchMetaText(id)
            .then(async data => {
                if (!isMounted) return;
                setMetaText(data);
                if (data.source_document_id) {
                    try {
                        const [doc, chunkData] = await Promise.all([
                            fetchSourceDocument(data.source_document_id),
                            fetchChunks(data.id)
                        ]);
                        if (!isMounted) return;
                        setSourceDocInfo(doc);
                        setChunks(chunkData.map(chunk => ({
                            ...chunk,
                            content: chunk.text
                        })));
                    } catch (e) {
                        if (!isMounted) return;
                        setErrors(prev => ({
                            ...prev,
                            sourceDoc: e.message?.includes('document') ? (e.message || 'Failed to load source document.') : prev.sourceDoc,
                            chunks: e.message?.includes('chunk') ? (e.message || 'Failed to load chunks.') : prev.chunks
                        }));
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

    // Add a refetchSourceDoc function
    const refetchSourceDoc = async () => {
        if (!metaText?.source_document_id) return;
        setErrors(prev => ({ ...prev, sourceDoc: '' }));
        try {
            const doc = await fetchSourceDocument(metaText.source_document_id);
            setSourceDocInfo(doc);
        } catch (e) {
            setErrors(prev => ({ ...prev, sourceDoc: e.message || 'Failed to reload source document.' }));
        }
    };

    return {
        metaText,
        loading,
        errors,
        sourceDocInfo,
        chunks,
        setChunks,
        setSourceDocInfo,
        refetchSourceDoc,
    };
}
