import React from 'react';
import { Box } from '@mui/material';
import { ToggleSelector } from 'components';
import { DocType, ViewMode } from 'types';

export const DOC_TYPE_OPTIONS = [
    { value: DocType.MetaText, label: 'Meta-Text', ariaLabel: 'Meta-Text' },
    { value: DocType.SourceDoc, label: 'Source Document', ariaLabel: 'Source Document' },
];

export const VIEW_MODE_OPTIONS = [
    { value: ViewMode.Search, label: 'Search', ariaLabel: 'Search' },
    { value: ViewMode.Create, label: 'Create', ariaLabel: 'Create' },
];

interface HomePageTogglesProps {
    docType: DocType;
    setDocType: (value: DocType) => void;
    viewMode: ViewMode;
    setViewMode: (value: ViewMode) => void;
    styles: any;
}

export function HomePageToggles({ docType, setDocType, viewMode, setViewMode, styles }: HomePageTogglesProps) {
    const handleDocTypeChange = (value: DocType) => setDocType(value);
    const handleViewModeChange = (value: ViewMode) => setViewMode(value);

    return (
        <Box sx={styles.toggleContainer}>
            <ToggleSelector
                value={docType}
                onChange={handleDocTypeChange}
                options={DOC_TYPE_OPTIONS}
            />
            <ToggleSelector
                value={viewMode}
                onChange={handleViewModeChange}
                options={VIEW_MODE_OPTIONS}
            />
        </Box>
    );
}
