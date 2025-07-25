import React, { useState, useMemo } from 'react';
import { Card, Box, useTheme } from '@mui/material';
import { createFlashcardStyles } from '../Flashcard.styles';
import FlashcardFront from './FlashcardFront';
import FlashcardBack from './FlashcardBack';

interface FlashcardProps {
    word: string;
    definition: string;
    definition_in_context: string;
    context: string;
}
export function Flashcard(props: FlashcardProps) {

    const { word, definition, definition_in_context, context } = props;
    const [flipped, setFlipped] = useState(false);
    const theme = useTheme();
    const styles = createFlashcardStyles(theme);

    return (
        <Card sx={styles.flashcardContainer}>
            <Box
                sx={{
                    ...styles.flashcard,
                    ...(flipped ? styles.flipped : {}),
                }}
            >
                <FlashcardFront word={word} styles={styles} setFlipped={setFlipped} />
                <FlashcardBack
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

export default Flashcard;
