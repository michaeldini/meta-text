import { useCallback } from 'react';

/**
 * Custom hook for managing MetaText section handlers.
 * @param {Function} setSections - React setState function for sections.
 * @returns {Object} Handlers for word click, remove section, and field change.
 */
export function useMetaTextSectionHandlers(setSections) {
    // Handle word click: split section at word index
    const handleWordClick = useCallback((sectionIdx, wordIdx) => {
        setSections(prevSections => {
            const currentSection = prevSections[sectionIdx];
            if (!currentSection || !currentSection.content) return prevSections;
            const words = currentSection.content.split(/\s+/);
            if (wordIdx < 0 || wordIdx >= words.length - 1) return prevSections; // Don't split at last word or out of bounds
            const before = words.slice(0, wordIdx + 1).join(' ');
            const after = words.slice(wordIdx + 1).join(' ');
            if (!before || !after) return prevSections; // Prevent empty sections
            const newSections = [...prevSections];
            // Replace current section with the first part
            newSections[sectionIdx] = {
                ...currentSection,
                content: before
            };
            // Insert the second part as a new section after the current
            newSections.splice(sectionIdx + 1, 0, {
                content: after,
                notes: '',
                summary: '',
                aiImageUrl: ''
            });
            return newSections;
        });
    }, [setSections]);

    // Remove a section and merge with the next
    const handleRemoveSection = useCallback((sectionIdx) => {
        setSections(prevSections => {
            if (sectionIdx >= prevSections.length - 1) return prevSections;
            const mergedContent = prevSections[sectionIdx].content + ' ' + prevSections[sectionIdx + 1].content;
            const newSections = [...prevSections];
            newSections.splice(sectionIdx, 2, {
                ...prevSections[sectionIdx],
                content: mergedContent
            });
            return newSections;
        });
    }, [setSections]);

    // Handle summary/notes/aiSummary field change
    const handleSectionFieldChange = useCallback((sectionIdx, field, value) => {
        setSections(prevSections => {
            const newSections = [...prevSections];
            newSections[sectionIdx] = {
                ...newSections[sectionIdx],
                [field]: value
            };
            return newSections;
        });
    }, [setSections]);

    return {
        handleWordClick,
        handleRemoveSection,
        handleSectionFieldChange
    };
}
