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
                // Auto-split only if there is a single long section
                normalizedSections = autoSplitSections(normalizedSections, 500);
                setSections(normalizedSections);
            })
            .catch(() => {
                setSectionsError('Failed to load meta-text.');
                setSections([]);
            })
            .finally(() => setSectionsLoading(false));
    }, [selectedMetaTextId, reloadIndex]);

    return { sections, setSections, sectionsLoading, sectionsError, reloadSections };
}

/**
 * Utility to split a section into chunks of maxWords (default 500).
 * Only splits if there is a single section with > maxWords words.
 * Returns the new sections array.
 */
export function autoSplitSections(sections, maxWords = 500) {
    if (!Array.isArray(sections) || sections.length !== 1) return sections;
    const section = sections[0];
    if (!section.content) return sections;
    const words = section.content.split(/\s+/);
    if (words.length <= maxWords) return sections;
    const newSections = [];
    for (let i = 0; i < words.length; i += maxWords) {
        newSections.push({
            ...section,
            content: words.slice(i, i + maxWords).join(' '),
            // Clear AI fields for all but the first section
            aiSummary: i === 0 ? section.aiSummary : '',
            aiImageUrl: i === 0 ? section.aiImageUrl : '',
            summary: i === 0 ? section.summary : '',
            notes: i === 0 ? section.notes : ''
        });
    }
    return newSections;
}
