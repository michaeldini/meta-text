import { useState, useEffect } from 'react';
import { fetchMetaText } from '../services/metaTextService';

/**
 * Custom hook to fetch and manage sections for a selected meta-text.
 * @param {string} selectedMetaText - The name/id of the selected meta-text.
 * @returns {object} { sections, setSections, sectionsLoading, sectionsError, reloadSections }
 */
export function useMetaTextSections(selectedMetaText) {
    const [sections, setSections] = useState([]);
    const [sectionsLoading, setSectionsLoading] = useState(false);
    const [sectionsError, setSectionsError] = useState('');
    const [reloadIndex, setReloadIndex] = useState(0);

    const reloadSections = () => setReloadIndex(i => i + 1);

    useEffect(() => {
        if (!selectedMetaText) {
            setSections([]);
            return;
        }
        setSectionsLoading(true);
        setSectionsError('');
        fetchMetaText(selectedMetaText)
            .then(data => {
                if (Array.isArray(data.content) && data.content.length > 0 && typeof data.content[0] === 'object') {
                    setSections(data.content);
                } else if (Array.isArray(data.content)) {
                    setSections(data.content.map(content => ({ content, notes: '', summary: '', aiImageUrl: '' })));
                } else if (typeof data.content === 'string') {
                    setSections([{ content: data.content, notes: '', summary: '', aiImageUrl: '' }]);
                } else {
                    setSections([]);
                }
            })
            .catch(() => {
                setSectionsError('Failed to load meta-text.');
                setSections([]);
            })
            .finally(() => setSectionsLoading(false));
    }, [selectedMetaText, reloadIndex]);

    return { sections, setSections, sectionsLoading, sectionsError, reloadSections };
}
