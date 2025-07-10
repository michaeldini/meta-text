// Front of a flashcard component that displays a word and allows flipping to see its definition

import React from 'react';
import { Box, CardActionArea, CardContent, Typography } from '@mui/material';

interface WordFlashcardFrontProps {
    word: string;
    styles: any;
    setFlipped: any;
}

const WordFlashcardFront: React.FC<WordFlashcardFrontProps> = ({ word, styles, setFlipped }) => (
    <Box sx={styles.front}>
        <CardActionArea
            sx={styles.flashcard}
            onClick={() => setFlipped(true)}
        >
            <CardContent sx={styles.front}>
                <Typography variant="h4" fontWeight={700} align="center">{word}</Typography>
            </CardContent>
        </CardActionArea>
    </Box>
);

export default WordFlashcardFront;
