// Main way for users to navigate to the main functionalities of the application.
// Two buttons to direct users to the SourceDocs and Metatext pages.

// Main way for users to navigate to the main functionalities of the application.
// Two buttons to direct users to the SourceDocs and Metatext pages.

import React from 'react';
import { Button } from '@chakra-ui/react/button';
import { Stack } from '@chakra-ui/react/stack';
import { useNavigate } from 'react-router-dom';



export function NavigationButtons() {
    const navigate = useNavigate();

    const handleNavigateToSourceDocs = () => {
        navigate('/sourcedoc');
    };

    const handleNavigateToMetatexts = () => {
        navigate('/metatext');
    };

    return (
        <Stack direction="row">
            <Button
                color="primary"
                variant="ghost"
                size="xl"
                onClick={handleNavigateToSourceDocs}
                data-testid="navigate-to-source-docs"
            >
                Browse Source Documents
            </Button>
            <Button
                color="primary"
                variant="ghost"
                size="xl"
                onClick={handleNavigateToMetatexts}
                data-testid="navigate-to-metatexts"
            >
                Browse Metatexts
            </Button>
        </Stack>
    );
}

export default NavigationButtons;
