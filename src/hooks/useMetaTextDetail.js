import { useEffect, useState } from 'react';
import { fetchMetaText } from '../services/metaTextService';
import { fetchSourceDocument } from '../services/sourceDocumentService';

export function useMetaTextDetail(id) {
    const [metaText, setMetaText] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({ metaText: '', sourceDoc: '' });
    const [sourceDocInfo, setSourceDocInfo] = useState(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setErrors({ metaText: '', sourceDoc: '' });
        setMetaText(null);
        setSourceDocInfo(null);
        fetchMetaText(id)
            .then(async data => {
                if (!isMounted) return;
                setMetaText(data);
                if (data.source_document_id) {
                    try {
                        const doc = await fetchSourceDocument(data.source_document_id);
                        if (!isMounted) return;
                        setSourceDocInfo(doc);
                    } catch (e) {
                        if (!isMounted) return;
                        setErrors(prev => ({
                            ...prev,
                            sourceDoc: e.message?.includes('document') ? (e.message || 'Failed to load source document.') : prev.sourceDoc,
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
        setSourceDocInfo,
        refetchSourceDoc,
    };
}
