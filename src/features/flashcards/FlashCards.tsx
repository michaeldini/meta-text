import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import WordFlashcard from './WordFlashcard';
import { createWordFlashcardStyles } from './WordFlashcard.styles';
import { useTheme } from '@mui/material/styles';

export interface WordlistRow {
    id: number;
    word: string;
    definition: string;
    definition_with_context: string;
    context?: string;
}

interface FlashCardsProps {
    wordlist: WordlistRow[];
}

const FlashCards: React.FC<FlashCardsProps> = ({ wordlist }) => {
    const theme = useTheme();
    const styles = createWordFlashcardStyles(theme);
    if (wordlist.length === 0) {
        return <Alert severity="info">No words found in the wordlist.</Alert>;
    }
    return (
        <>
            <Typography variant="h5" gutterBottom sx={styles.wordlistTitle}>Flashcards</Typography>
            <Box sx={styles.wordlistWrap}>
                {wordlist.map(row => (
                    <WordFlashcard
                        key={row.id}
                        word={row.word}
                        definition={row.definition}
                        definitionWithContext={row.definition_with_context}
                        context={row.context}
                    />
                ))}
            </Box>
        </>
    );
};

export default FlashCards;
