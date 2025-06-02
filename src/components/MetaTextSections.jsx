import React from 'react';
import { Box } from '@mui/material';
import MetaTextSection from './MetaTextSection';

export default function MetaTextSections({ sections, handleWordClick, handleRemoveSection, handleSectionFieldChange }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
            {sections.map((section, sectionIdx) => (
                <MetaTextSection
                    key={sectionIdx}
                    section={section}
                    sectionIdx={sectionIdx}
                    isLastSection={sectionIdx === sections.length - 1}
                    handleWordClick={handleWordClick}
                    handleRemoveSection={handleRemoveSection}
                    handleSectionFieldChange={handleSectionFieldChange}
                />
            ))}
        </Box>
    );
}