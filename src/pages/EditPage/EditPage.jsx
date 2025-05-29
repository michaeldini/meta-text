import React, { useState, useEffect, useCallback } from 'react';
import './EditPage.css';
import SectionSplitter from '../../components/SectionSplitter';
import { fetchMetaTextList, fetchMetaTextContent, saveMetaText } from '../../services/metaTextService';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import MetaTextSelect from '../../components/MetaTextSelect';

export default function EditPage() {
    // --- State for split document selection and content ---
    const [splitDocs, setSplitDocs] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState('');
    const [sections, setSections] = useState([]); // Array of text sections
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Fetch meta-text names on mount
    useEffect(() => {
        fetchMetaTextList()
            .then(data => setSplitDocs(data.meta_texts || []))
            .catch(() => setSplitDocs([]));
    }, []);

    // Fetch meta-text content when selectedDoc changes
    useEffect(() => {
        if (!selectedDoc) {
            setSections([]);
            return;
        }
        setLoading(true);
        setError('');
        fetchMetaTextContent(selectedDoc)
            .then(data => {
                // Expect sections to be an array of section objects
                if (Array.isArray(data.sections) && data.sections.length > 0 && typeof data.sections[0] === 'object') {
                    setSections(data.sections);
                } else if (Array.isArray(data.sections)) {
                    // fallback for legacy string array
                    setSections(data.sections.map(content => ({ content, notes: '', summary: '', aiImageUrl: '' })));
                } else if (typeof data.content === 'string') {
                    setSections([{ content: data.content, notes: '', summary: '', aiImageUrl: '' }]);
                } else {
                    setSections([]);
                }
            })
            .catch(() => {
                setError('Failed to load meta-text.');
                setSections([]);
            })
            .finally(() => setLoading(false));
    }, [selectedDoc]);

    // --- Handle word click: split section at word index ---
    const handleWordClick = useCallback((sectionIdx, wordIdx) => {
        setSections(prevSections => {
            const current = prevSections[sectionIdx];
            const words = current.content.split(/\s+/);
            const before = words.slice(0, wordIdx + 1).join(' ');
            const after = words.slice(wordIdx + 1).join(' ');
            const newSections = [...prevSections];
            newSections.splice(sectionIdx, 1, {
                ...current,
                content: before
            });
            if (after) {
                newSections.splice(sectionIdx + 1, 0, {
                    content: after,
                    notes: '',
                    summary: '',
                    aiImageUrl: ''
                });
            }
            return newSections;
        });
    }, []);

    // --- Remove a section and merge with the next ---
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
    }, []);

    // --- Validate section structure ---
    const isValidSection = (section) =>
        section &&
        typeof section.content === 'string' &&
        typeof section.notes === 'string' &&
        typeof section.summary === 'string' &&
        typeof section.aiImageUrl === 'string';

    // --- Save handler (with validation) ---
    const handleSave = () => {
        if (!selectedDoc) {
            alert('No document selected.');
            return;
        }
        // Validate all sections before saving
        if (!sections.every(isValidSection)) {
            alert('Section structure invalid. Please reload or contact support.');
            return;
        }
        saveMetaText(selectedDoc, sections)
            .then(() => {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 2000);
            })
            .catch(() => {
                alert('Save failed.');
            });
    };

    return (
        <div className="editpage-root">
            <div>
                <h1 className="editpage-main-header">Meta-Text Splitter</h1>
                {/* Dropdown for split document selection */}
                <div className="editpage-input-row">
                    <MetaTextSelect
                        splitDocs={splitDocs}
                        selectedDoc={selectedDoc}
                        setSelectedDoc={setSelectedDoc}
                        loading={loading}
                        error={error}
                    />
                </div>
                {/* Show content if loaded */}
                {sections.length > 0 && (
                    <div>
                        {/* Only Column: Interactive splitting */}
                        <SectionSplitter
                            sections={sections}
                            handleWordClick={handleWordClick}
                            handleRemoveSection={handleRemoveSection}
                        />
                    </div>
                )}
                {/* Sticky Save Button */}
                <div className="editpage-sticky-save-btn">
                    <button
                        className="editpage-save-btn"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                    {success && <SuccessMessage message="Document saved!" />}
                </div>
            </div>
        </div>
    );
}

