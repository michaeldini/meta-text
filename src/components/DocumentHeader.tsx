// Component used to display a document header with a title and children components for consistent styling across pages.

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Stack, Typography, useTheme } from '@mui/material';
import { ExpandMoreIcon } from 'icons';

interface DocumentHeaderProps {
    title?: string;
    children: React.ReactNode;
    sx?: object;
    elevation?: number;
}


const DocumentHeader: React.FC<DocumentHeaderProps> = ({
    title,
    children,
    sx = {},
    elevation = 10
}) => {
    const theme = useTheme();
    return (
        <Accordion sx={{ width: '100%', mb: theme.spacing(4), ...sx }} elevation={elevation}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="document-header-content"
                id="document-header-toggle"
                sx={{
                    background: theme.palette.background.paper,
                    borderRadius: theme.shape.borderRadius,

                }}
            >
                <Typography variant="h3" color={theme.palette.text.secondary}>
                    {title}
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: theme.spacing(2), border: `1px solid ${theme.palette.divider}` }}>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{ flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}
                >
                    {children}
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
};

export default DocumentHeader;
