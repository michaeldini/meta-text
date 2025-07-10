// Main way for users to navigate to the main functionalities of the application.
// Two buttons to direct users to the SourceDocs and MetaText pages.

import React from 'react';
import { Box, Button } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

interface NavigationButtonsProps {
    styles: SxProps<Theme>;
}

// Define button properties for consistent styling across buttons
const buttonProps = {
    variant: 'outlined' as const,
    color: 'secondary' as const,
    size: 'large' as const,
};

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
                {...buttonProps}
                onClick={handleNavigateToSourceDocs}
                data-testid="navigate-to-source-docs"
            >
                Browse Source Documents
            </Button>
            <Button
                {...buttonProps}
                onClick={handleNavigateToMetaTexts}
                data-testid="navigate-to-metatexts"
            >
                Browse MetaTexts
            </Button>
        </Box>
    );
};

export default NavigationButtons;
