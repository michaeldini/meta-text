import React from 'react';
import { Box, Button } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

interface NavigationButtonsProps {
    styles: SxProps<Theme>;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ styles }) => {
    const navigate = useNavigate();

    const handleNavigateToSourceDocs = () => {
        navigate('/sourcedoc');
    };

    const handleNavigateToMetaTexts = () => {
        navigate('/metatext');
    };

    return (
        <Box sx={styles}>
            <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={handleNavigateToSourceDocs}
                data-testid="navigate-to-source-docs"
            >
                Browse Source Documents
            </Button>
            <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={handleNavigateToMetaTexts}
                data-testid="navigate-to-metatexts"
            >
                Browse MetaTexts
            </Button>
        </Box>
    );
};

export default NavigationButtons;
