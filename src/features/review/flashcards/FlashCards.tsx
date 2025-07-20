// Flashcard component to display cards for vocabulary review
// This component renders a list of flashcards based on the provided wordlist
// It uses Card components that flip to show the definition and context of each word

import React from 'react';
import { Box, Typography } from '@mui/material';
import WordFlashcard from './WordFlashcard';
import { createWordFlashcardStyles } from './WordFlashcard.styles';
import { useTheme } from '@mui/material/styles';
import { FlashcardItem } from 'types';
import { AppAlert } from 'components';

interface FlashCardsProps {
    flashcardItems: FlashcardItem[];
}

const FlashCards: React.FC<FlashCardsProps> = ({ flashcardItems }) => {
    const theme = useTheme();
    const styles = createWordFlashcardStyles(theme);

    const flashcardWords = flashcardItems.filter(item => item.type === 'word');
    if (flashcardWords.length === 0) {
        return <AppAlert severity="info">No words yet. Define some words in the metatext editor to see them appear here.</AppAlert>;
    }

    return (
        <>
            <Box sx={styles.wordlistWrap}>
                {flashcardWords.map(item => (
                    <WordFlashcard
                        key={item.id}
                        word={item.words}
                        definition={item.explanation}
                        definition_in_context={item.definition_in_context}
                        context={item.context}
                    />
                ))}
            </Box>
        </>
    );
};

export default FlashCards;
