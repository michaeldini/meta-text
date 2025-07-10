import React, { useState, useMemo } from 'react';
import { Card, Box, useTheme } from '@mui/material';
import { createWordFlashcardStyles } from './WordFlashcard.styles';
import WordFlashcardFront from './WordFlashcardFront';
import WordFlashcardBack from './WordFlashcardBack';

interface WordFlashcardProps {
    word: string;
    definition: string;
    definitionWithContext: string;
    context: string;
}

const WordFlashcard: React.FC<WordFlashcardProps> = ({ word, definition, definitionWithContext, context }) => {
    const [flipped, setFlipped] = useState(false);
    const theme = useTheme();
    const styles = createWordFlashcardStyles(theme);

    return (
        <Card sx={styles.flashcardContainer}>
            <Box
                sx={{
                    ...styles.flashcard,
                    ...(flipped ? styles.flipped : {}),
                }}
            >
                <WordFlashcardFront word={word} styles={styles} setFlipped={setFlipped} />
                <WordFlashcardBack
                    word={word}
                    definition={definition}
                    definitionWithContext={definitionWithContext}
                    context={context}
                    setFlipped={setFlipped}
                />
            </Box>
        </Card>
    );
};

export default WordFlashcard;
