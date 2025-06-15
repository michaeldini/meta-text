import { useEffect, useState } from 'react';
import { fetchMetaText } from '../services/metaTextService';
import { fetchSourceDocument } from '../services/sourceDocumentService';
import type { MetaText } from '../types/metaText';
import type { SourceDocument } from '../types/sourceDocument';

export interface MetaTextDetailErrors {
    metaText: string;
    sourceDoc: string;
}

export function useMetaTextDetail(metaTextId?: string) {
    const [metaText, setMetaText] = useState<MetaText | null>(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState<MetaTextDetailErrors>({ metaText: '', sourceDoc: '' });
    const [sourceDocInfo, setSourceDocInfo] = useState<SourceDocument | null>(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setErrors({ metaText: '', sourceDoc: '' });
        setMetaText(null);
        setSourceDocInfo(null);
        if (!metaTextId) {
            setErrors({ metaText: 'No metaTextId provided', sourceDoc: '' });
            setLoading(false);
            return;
        }
        fetchMetaText(Number(metaTextId))
            .then(async data => {
                if (!isMounted) return;
                setMetaText(data);
                if (data.source_document_id) {
                    try {
                        const doc = await fetchSourceDocument(data.source_document_id);
                        if (!isMounted) return;
                        setSourceDocInfo(doc);
                    } catch (e: any) {
                        if (!isMounted) return;
                        setErrors(prev => ({
                            ...prev,
                            sourceDoc: e.message?.includes('document') ? (e.message || 'Failed to load source document.') : prev.sourceDoc,
                        }));
                    }
                }
            })
            .catch((e: any) => {
                if (!isMounted) return;
                setErrors(prev => ({ ...prev, metaText: e.message || 'Failed to load meta text.' }));
            })
            .finally(() => {
                if (!isMounted) return;
                setLoading(false);
            });
        return () => { isMounted = false; };
    }, [metaTextId]);

    // Add a refetchSourceDoc function
    const refetchSourceDoc = async () => {
        if (!metaText?.source_document_id) return;
        setErrors(prev => ({ ...prev, sourceDoc: '' }));
        try {
            const doc = await fetchSourceDocument(metaText.source_document_id);
            setSourceDocInfo(doc);
        } catch (e: any) {
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
