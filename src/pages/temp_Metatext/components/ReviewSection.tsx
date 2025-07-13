import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import type { ReactElement } from 'react';
import { ExpandMoreIcon } from 'icons';

interface ReviewSectionProps {
    title: string;
    testId: string;
    children: ReactElement;
}

export function ReviewSection({ title, testId, children }: ReviewSectionProps): ReactElement {
    return (
        <Accordion sx={{ mb: 2 }} data-testid={testId}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    );
}
