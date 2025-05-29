import React from 'react';

export default function SectionSplitter({ sections, handleWordClick, handleRemoveSection }) {
    return (
        <div>
            <h2 className="editpage-split-header">Split</h2>
            <div className="editpage-sections-list">
                {sections.map((section, sectionIdx) => {
                    const words = section.content.split(/\s+/);
                    return (
                        <div
                            key={sectionIdx}
                            className="editpage-text-block editpage-section"
                        >
                            <div className="editpage-text-block-content">
                                {words.map((word, wordIdx) => (
                                    <span
                                        key={wordIdx}
                                        className="editpage-word"
                                        onClick={() => handleWordClick(sectionIdx, wordIdx)}
                                    >
                                        {word}{wordIdx < words.length - 1 && ' '}
                                        {/* If this is the last word and not the last section, show the remove icon button inline */}
                                        {wordIdx === words.length - 1 && sectionIdx < sections.length - 1 && (
                                            <button
                                                className="editpage-remove-section-btn"
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
    );
}