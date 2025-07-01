import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import { ExpandMoreIcon } from 'icons';

export interface PhraseExplanation {
    id: number;
    phrase: string;
    context: string;
    explanation: string;
    explanation_with_context: string;
    meta_text_id: number | null;
}

interface PhrasesProps {
    data: PhraseExplanation[];
}

const Phrases: React.FC<PhrasesProps> = ({ data }) => {
    if (!data.length) return null;
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Phrases & Explanations</Typography>
            {data.map((row) => (
                <Accordion key={row.id} sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1">{row.phrase}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Explanation</Typography>
                                <Typography>{row.explanation}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Explanation in Context</Typography>
                                <Typography>{row.explanation_with_context}</Typography>
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

export default Phrases;
