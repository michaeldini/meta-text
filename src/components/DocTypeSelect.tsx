import React from 'react';
import { ToggleButton, ToggleButtonGroup, Box, Fade } from '@mui/material';

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
        <Fade in={true} timeout={900}>
            <Box sx={{ my: 2 }}>
                <ToggleButtonGroup
                    value={value}
                    exclusive
                    onChange={handleChange}
                    aria-label="document type"
                    disabled={disabled}
                >
                    <ToggleButton value="metaText" aria-label="Meta-Text">
                        Meta-Text
                    </ToggleButton>
                    <ToggleButton value="sourceDoc" aria-label="Source Document">
                        Source Document
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </Fade>
    );
};

export default DocTypeSelect;
