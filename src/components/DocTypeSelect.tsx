import React from 'react';
import { ToggleButton, ToggleButtonGroup, Box } from '@mui/material';

export type DocType = 'sourceDoc' | 'metaText';

export interface DocTypeSelectProps {
    value: DocType;
    onChange: (value: DocType) => void;
    disabled?: boolean;
}

const DocTypeSelect: React.FC<DocTypeSelectProps> = ({ value, onChange, disabled }) => {
    const handleChange = (_event: React.MouseEvent<HTMLElement>, newValue: DocType | null) => {
        if (newValue) onChange(newValue);
    };
    return (
        <Box sx={{ mb: 2 }}>
            <ToggleButtonGroup
                value={value}
                exclusive
                onChange={handleChange}
                aria-label="document type"
                disabled={disabled}
            >
                <ToggleButton value="sourceDoc" aria-label="Source Document">
                    Source Document
                </ToggleButton>
                <ToggleButton value="metaText" aria-label="Meta-Text">
                    Meta-Text
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
};

export default DocTypeSelect;
