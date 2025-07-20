import React, { useState, useMemo } from 'react';
import { Card, Box, useTheme } from '@mui/material';
import { createWordFlashcardStyles } from './WordFlashcard.styles';
import WordFlashcardFront from './WordFlashcardFront';
import WordFlashcardBack from './WordFlashcardBack';

interface WordFlashcardProps {
    word: string;
    definition: string;
    definition_in_context: string;
    context: string;
}

const WordFlashcard: React.FC<WordFlashcardProps> = ({ word, definition, definition_in_context, context }) => {
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
                    definition_in_context={definition_in_context}
                    context={context}
                    setFlipped={setFlipped}
                />
            </Box>
        </Card>
    );
};

export default WordFlashcard;
