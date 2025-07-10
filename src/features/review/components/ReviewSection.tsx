/**
 * @fileoverview ReviewSection component for MetaText Review
 * 
 * A reusable component that wraps content in a consistent accordion structure.
 * Eliminates code duplication and provides a standard layout for review sections.
 * 
 * @author MetaText Development Team
 * @version 1.0.0
 * @since 2025-07-09
 */

import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import type { ReactElement } from 'react';
import { ExpandMoreIcon } from 'icons';

/**
 * ReviewSection Component Props
 */
interface ReviewSectionProps {
    /** The section title displayed in the accordion header */
    title: string;
    /** Test ID for the accordion element */
    testId: string;
    /** The content to display inside the accordion */
    children: ReactElement;
}

/**
 * ReviewSection Component
 * 
 * A reusable component that wraps content in a consistent accordion structure.
 * Eliminates code duplication and provides a standard layout for review sections.
 * 
 * @param props - Component props
 * @param props.title - The section title displayed in the accordion header
 * @param props.testId - Test ID for the accordion element
 * @param props.children - The content to display inside the accordion
 * @returns {ReactElement} The accordion section component
 * 
 * @example
 * ```tsx
 * <ReviewSection title="Flashcards" testId="flashcards-section">
 *   <FlashCards wordlist={wordlist} />
 * </ReviewSection>
 * ```
 */
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
