import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Paper } from '@mui/material';
import { ExpandMoreIcon } from 'icons';

export interface Explanation {
    id: number;
    phrase: string;
    context: string;
    explanation: string;
    explanation_with_context: string;
    meta_text_id: number | null;
}

interface ExplanationReviewProps {
    data: Explanation[];
}

interface ExplanationCardProps {
    title: string;
    content: string;
    elevation?: number;
}

const ExplanationCard: React.FC<ExplanationCardProps> = ({ title, content, elevation = 5 }) => (
    <Paper elevation={elevation} sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
            {title}
        </Typography>
        <Typography>{content}</Typography>
    </Paper>
);

interface ExplanationItemProps {
    explanation: Explanation;
}

const ExplanationItem: React.FC<ExplanationItemProps> = ({ explanation }) => (
    <Accordion sx={{ mb: 5 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">{explanation.phrase}</Typography>
        </AccordionSummary>
        <AccordionDetails >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pl: 2 }}>
                <ExplanationCard
                    title="Explanation"
                    content={explanation.explanation}
                    elevation={5}
                />
                <ExplanationCard
                    title="Explanation in Context"
                    content={explanation.explanation_with_context}
                    elevation={20}
                />
            </Box>
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
