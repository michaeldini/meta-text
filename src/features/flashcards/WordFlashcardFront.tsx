import React from 'react';
import { Box, CardContent, Typography } from '@mui/material';

interface WordFlashcardFrontProps {
    word: string;
    styles: any;
}

const WordFlashcardFront: React.FC<WordFlashcardFrontProps> = ({ word, styles }) => (
    <Box sx={styles.front}>
        <CardContent>
            <Typography variant="h4" fontWeight={700} align="center">{word}</Typography>
        </CardContent>
    </Box>
);

export default WordFlashcardFront;
