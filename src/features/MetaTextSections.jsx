import React, { useState } from 'react';
import { Box, Pagination } from '@mui/material';
import MetaTextSection from './MetaTextSection';

export default function MetaTextSections({ sections, handleWordClick, handleRemoveSection, handleSectionFieldChange }) {
    const [page, setPage] = useState(1);
    const sectionsPerPage = 5;
    const pageCount = Math.ceil(sections.length / sectionsPerPage);
    const startIdx = (page - 1) * sectionsPerPage;
    const endIdx = startIdx + sectionsPerPage;
    const paginatedSections = sections.slice(startIdx, endIdx);

    const handleChange = (event, value) => {
        setPage(value);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
            {paginatedSections.map((section, sectionIdx) => (
                <MetaTextSection
                    key={startIdx + sectionIdx}
                    section={section}
                    sectionIdx={startIdx + sectionIdx}
                    handleWordClick={handleWordClick}
                    handleRemoveSection={handleRemoveSection}
                    handleSectionFieldChange={handleSectionFieldChange}
                />
            ))}
            {pageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination count={pageCount} page={page} onChange={handleChange} color="primary" />
                </Box>
            )}
        </Box>
    );
}