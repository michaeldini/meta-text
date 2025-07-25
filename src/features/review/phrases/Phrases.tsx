// Component to review explanations of phrases with context and explanations
// This component displays a list of explanations, each with its own context and explanation details.
// Extensive use of Material-UI Accordion components for a collapsible view.

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Paper } from '@mui/material';
import { ExpandMoreIcon } from 'icons';
import { Explanation } from 'types';

import styles from './styles';


interface PhrasesProps {
    phrases: Explanation[];
}

interface PhraseItemProps {
    phrase: Explanation;
}

interface PhraseCardProps {
    title: string;
    content: string;
    elevation?: number;
}

export function PhraseCard({ title, content, elevation = 5 }: PhraseCardProps) {
    return (
        <Paper elevation={elevation} sx={styles.paper}>
            <Typography variant="subtitle2" color="text.secondary">
                {title}
            </Typography>
            <Typography>{content}</Typography>
        </Paper>
    );
}

export function PhraseItem({ phrase }: PhraseItemProps) {
    return (
        <Accordion sx={styles.accordion}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">{phrase.words}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={styles.accordionDetails}>
                <PhraseCard
                    title="Explanation"
                    content={phrase.explanation}
                    elevation={5}
                />
                <PhraseCard
                    title="Explanation in Context"
                    content={phrase.explanation_in_context}
                    elevation={20}
                />
            </AccordionDetails>
        </Accordion>
    );
}

export function Phrases({ phrases }: PhrasesProps) {
    if (!phrases.length) return null;

    return (
        <Box sx={{ mt: 4 }}>
            {phrases.map((phrase) => (
                <PhraseItem
                    key={phrase.id}
                    phrase={phrase}
                />
            ))}
        </Box>
    );
}

export default Phrases;
