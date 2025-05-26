import React, { useState, useEffect } from 'react';
import './App.css';

export default function EditPage() {
    // --- State for split document selection and content ---
    const [splitDocs, setSplitDocs] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState('');
    const [mainText, setMainText] = useState('');
    const [sections, setSections] = useState([]); // Array of text sections
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch split document names on mount
    useEffect(() => {
        fetch('/api/list-split-documents')
            .then(res => res.json())
            .then(data => setSplitDocs(data.split_documents || []))
            .catch(() => setSplitDocs([]));
    }, []);

    // Fetch split document content when selectedDoc changes
    useEffect(() => {
        if (!selectedDoc) {
            setMainText('');
            setSections([]);
            return;
        }
        setLoading(true);
        setError('');
        fetch(`/api/get-split-document/${encodeURIComponent(selectedDoc)}`)
            .then(res => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then(data => {
                // Expect sections to be an array of section objects
                if (Array.isArray(data.sections) && data.sections.length > 0 && typeof data.sections[0] === 'object') {
                    setSections(data.sections);
                    setMainText(data.sections.map(s => s.content).join(' '));
                } else if (Array.isArray(data.sections)) {
                    // fallback for legacy string array
                    setSections(data.sections.map(content => ({ content, notes: '', summary: '', aiImageUrl: '' })));
                    setMainText(data.sections.join(' '));
                } else if (typeof data.content === 'string') {
                    setSections([{ content: data.content, notes: '', summary: '', aiImageUrl: '' }]);
                    setMainText(data.content);
                } else {
                    setSections([]);
                    setMainText('');
                }
            })
            .catch(() => {
                setMainText('');
                setError('Failed to load split document.');
            })
            .finally(() => setLoading(false));
    }, [selectedDoc]);

    // Initialize sections from mainText if sections is empty
    useEffect(() => {
        if (mainText && sections.length === 0) {
            setSections([{ content: mainText, notes: '', summary: '', aiImageUrl: '' }]);
        }
    }, [mainText, sections.length]);

    // --- Handle word click: split section at word index ---
    const handleWordClick = (sectionIdx, wordIdx) => {
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
    };

    // --- Remove a section and merge with the next ---
    const handleRemoveSection = (sectionIdx) => {
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
    };

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
        fetch('/api/save-split-document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: selectedDoc,
                sections, // array of section objects
            }),
        })
            .then(res => {
                if (!res.ok) throw new Error('Save failed');
                return res.json();
            })
            .then(() => {
                alert('Document saved!');
            })
            .catch(() => {
                alert('Save failed.');
            });
    };

    return (
        <div className="app-root">
            <div className="split-main-container">
                <h1 className="main-header">Meta-Text Splitter</h1>
                {/* Dropdown for split document selection */}
                <div className="input-row">
                    <h2 className="split-header">Select Split-Document</h2>
                    <select
                        className="main-textarea"
                        value={selectedDoc}
                        onChange={e => setSelectedDoc(e.target.value)}
                    >
                        <option value="">-- Choose a split-document --</option>
                        {splitDocs.map((name, idx) => (
                            <option key={idx} value={name}>{name}</option>
                        ))}
                    </select>
                    {loading && <div className="loading-message">Loading...</div>}
                    {error && <div className="error-message">{error}</div>}
                </div>
                {/* Show content if loaded */}
                {sections.length > 0 && (
                    <div className="split-columns-layout one-col">
                        {/* Only Column: Interactive splitting */}
                        <div className="split-col text-col">
                            <h2 className="split-header">Split</h2>
                            <div className="sections-list">
                                {sections.map((section, sectionIdx) => {
                                    const words = section.content.split(/\s+/);
                                    return (
                                        <div
                                            key={sectionIdx}
                                            className="text-block section"
                                        >
                                            <div className="text-block-content">
                                                {words.map((word, wordIdx) => (
                                                    <span
                                                        key={wordIdx}
                                                        className="word"
                                                        onClick={() => handleWordClick(sectionIdx, wordIdx)}
                                                    >
                                                        {word}{wordIdx < words.length - 1 && ' '}
                                                        {/* If this is the last word and not the last section, show the remove icon button inline */}
                                                        {wordIdx === words.length - 1 && sectionIdx < sections.length - 1 && (
                                                            <button
                                                                className="remove-section-btn"
                                                                onClick={e => { e.stopPropagation(); handleRemoveSection(sectionIdx); }}
                                                                title="Undo split (merge with next section)"
                                                            >
                                                                {/* Undo arrow SVG icon */}
                                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M8 4L3 9L8 14" stroke="#b8bfff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M3 9H13C15.7614 9 18 11.2386 18 14C18 16.7614 15.7614 19 13 19H11" stroke="#b8bfff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
                {/* Sticky Save Button */}
                <div className="sticky-save-btn">
                    <button
                        className="save-btn"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
