import React from 'react';
import { Box, Typography } from '@mui/material';

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
            <Box component="table" >
                <Box component="thead" >
                    <Box component="tr">
                        <Box component="th">Phrase</Box>
                        <Box component="th">Explanation</Box>
                        <Box component="th">Explanation in Context</Box>
                    </Box>
                </Box>
                <Box component="tbody">
                    {data.map((row) => (
                        <Box component="tr" key={row.id}>
                            <Box component="td" sx={{ p: 1, verticalAlign: 'top' }}>{row.phrase}</Box>
                            <Box component="td" sx={{ p: 1, verticalAlign: 'top' }}>{row.explanation}</Box>
                            <Box component="td" sx={{ p: 1, verticalAlign: 'top' }}>{row.explanation_with_context}</Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default Phrases;
