import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import type { ReactElement } from 'react';
import { HiChevronDown } from 'react-icons/hi2';
interface ReviewSectionProps {
    title: string;
    testId: string;
    children: ReactElement;
}

/**
 * A reusable section component for displaying review content.
 * It uses an accordion to allow users to expand and collapse sections.
 *
 * @param {string} title - The title of the section.
 * @param {string} testId - The data-testid for testing purposes.
 * @param {ReactElement} children - The content to display within the section.
 * @returns {ReactElement} The rendered ReviewSection component.
 */
export function ReviewSection({ title, testId, children }: ReviewSectionProps): ReactElement {
    return (
        <Accordion sx={{ mb: 2 }} data-testid={testId}>
            <AccordionSummary expandIcon={<HiChevronDown />}>
                <Typography variant="h5">{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>
    );
}
