import React, { useState, useMemo } from 'react';
import { Card, CardActionArea, useTheme } from '@mui/material';
import { createWordFlashcardStyles } from './WordFlashcard.styles';
import WordFlashcardFront from './WordFlashcardFront';
import WordFlashcardBack from './WordFlashcardBack';

interface WordFlashcardProps {
    word: string;
    definition: string;
    definitionWithContext: string;
    context?: string;
}

const WordFlashcard: React.FC<WordFlashcardProps> = ({ word, definition, definitionWithContext, context }) => {
    const [flipped, setFlipped] = useState(false);
    const theme = useTheme();
    const styles = useMemo(() => createWordFlashcardStyles(theme), [theme]);

    return (
        <Card sx={styles.flashcardContainer} elevation={3}>
            <CardActionArea
                sx={{ ...styles.flashcard, ...(flipped ? styles.flipped : {}), height: '100%' }}
                onClick={() => setFlipped(f => !f)}
            >
                <WordFlashcardFront word={word} styles={styles} />
                <WordFlashcardBack
                    word={word}
                    definition={definition}
                    definitionWithContext={definitionWithContext}
                    context={context}
                />
            </CardActionArea>
        </Card>
    );
};

export default WordFlashcard;
