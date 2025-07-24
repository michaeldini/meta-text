// Main way for users to navigate to the main functionalities of the application.
// Two buttons to direct users to the SourceDocs and Metatext pages.

import React from 'react';
import { Box, Button, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';



// Define button properties for consistent styling across buttons
const buttonProps = {
    variant: 'outlined' as const,
    color: 'secondary' as const,
    size: 'large' as const,
};

export function NavigationButtons() {
    const navigate = useNavigate();

    const handleNavigateToSourceDocs = () => {
        navigate('/sourcedoc');
    };

    const handleNavigateToMetatexts = () => {
        navigate('/metatext');
    };

    return (
        <Stack direction="row" spacing={2}>
            <Button
                {...buttonProps}
                onClick={handleNavigateToSourceDocs}
                data-testid="navigate-to-source-docs"
            >
                Browse Source Documents
            </Button>
            <Button
                {...buttonProps}
                onClick={handleNavigateToMetatexts}
                data-testid="navigate-to-metatexts"
            >
                Browse Metatexts
            </Button>
        </Stack>
    );
};

export default NavigationButtons;
