// Flashcard component to display cards for vocabulary review
// This component renders a list of flashcards based on the provided wordlist
// It uses Card components that flip to show the definition and context of each word

import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import WordFlashcard from './WordFlashcard';
import { createWordFlashcardStyles } from './WordFlashcard.styles';
import { useTheme } from '@mui/material/styles';
import { FlashcardItem } from 'types';

interface FlashCardsProps {
    flashcardItems: FlashcardItem[];
}

const FlashCards: React.FC<FlashCardsProps> = ({ flashcardItems }) => {
    const theme = useTheme();
    const styles = createWordFlashcardStyles(theme);

    if (flashcardItems.length === 0) {
        return <Alert severity="info">No words yet. Define some words in the metatext editor to see them appear here.</Alert>;
    }
    return (
        <>
            <Box sx={styles.wordlistWrap}>
                {flashcardItems.map(item => (
                    <WordFlashcard
                        key={item.id}
                        word={item.word}
                        definition={item.definition}
                        definitionWithContext={item.definition_with_context}
                        context={item.context}
                    />
                ))}
            </Box>
        </>
    );
};

export default FlashCards;
