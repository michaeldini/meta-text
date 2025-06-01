import { useState, useEffect } from 'react';
import { fetchMetaText } from '../services/metaTextService';

/**
 * Custom hook to fetch and manage sections for a selected meta-text.
 * @param {number|string} selectedMetaTextId - The id of the selected meta-text.
 * @returns {object} { sections, setSections, sectionsLoading, sectionsError, reloadSections }
 */
export function useMetaTextSections(selectedMetaTextId) {
    const [sections, setSections] = useState([]);
    const [sectionsLoading, setSectionsLoading] = useState(false);
    const [sectionsError, setSectionsError] = useState('');
    const [reloadIndex, setReloadIndex] = useState(0);

    const reloadSections = () => setReloadIndex(i => i + 1);

    useEffect(() => {
        if (!selectedMetaTextId) {
            setSections([]);
            return;
        }
        setSectionsLoading(true);
        setSectionsError('');
        fetchMetaText(selectedMetaTextId)
            .then(data => {
                console.log('Fetched data.content:', data.content);
                let normalizedSections = [];
                if (Array.isArray(data.content)) {
                    normalizedSections = data.content.map(item =>
                        typeof item === 'object'
                            ? {
                                content: item.content || '',
                                notes: item.notes || '',
                                summary: item.summary || '',
                                aiImageUrl: item.aiImageUrl || '',
                                aiSummary: item.aiSummary || ''
                            }
                            : { content: item, notes: '', summary: '', aiImageUrl: '', aiSummary: '' }
                    );
                } else if (typeof data.content === 'string') {
                    normalizedSections = [{ content: data.content, notes: '', summary: '', aiImageUrl: '', aiSummary: '' }];
                }
                setSections(normalizedSections);
                console.log('Set sections:', normalizedSections);
            })
            .catch(() => {
                setSectionsError('Failed to load meta-text.');
                setSections([]);
            })
            .finally(() => setSectionsLoading(false));
    }, [selectedMetaTextId, reloadIndex]);

    return { sections, setSections, sectionsLoading, sectionsError, reloadSections };
}
