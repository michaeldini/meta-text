// Component to review explanations of phrases with context and explanations
// This component displays a list of explanations, each with its own context and explanation details.
// Extensive use of Material-UI Accordion components for a collapsible view.

import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Paper } from '@mui/material';
import { ExpandMoreIcon } from 'icons';
import { Explanation } from 'types';

import styles from './styles';

// export interface Explanation {
//     id: number;
//     words: string;
//     context: string;
//     explanation: string;
//     explanation_in_context: string;
//     metatext_id: number | null;
//     type: 'word' | 'phrase';
// }

interface ExplanationReviewProps {
    data: Explanation[];
}

interface ExplanationItemProps {
    explanation: Explanation;
}

interface ExplanationCardProps {
    title: string;
    content: string;
    elevation?: number;
}

const ExplanationCard: React.FC<ExplanationCardProps> = ({ title, content, elevation = 5 }) => (
    <Paper elevation={elevation} sx={styles.paper}>
        <Typography variant="subtitle2" color="text.secondary">
            {title}
        </Typography>
        <Typography>{content}</Typography>
    </Paper>
);

const ExplanationItem: React.FC<ExplanationItemProps> = ({ explanation }) => (
    <Accordion sx={styles.accordion}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">{explanation.words}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={styles.accordionDetails}>
            <ExplanationCard
                title="Explanation"
                content={explanation.explanation}
                elevation={5}
            />
            <ExplanationCard
                title="Explanation in Context"
                content={explanation.explanation_in_context}
                elevation={20}
            />
        </AccordionDetails>
    </Accordion>
);

const ExplanationReview: React.FC<ExplanationReviewProps> = ({ data }) => {
    if (!data.length) return null;

    return (
        <Box sx={{ mt: 4 }}>
            {data.map((explanation) => (
                <ExplanationItem
                    key={explanation.id}
                    explanation={explanation}
                />
            ))}
        </Box>
    );
};

export default ExplanationReview;
