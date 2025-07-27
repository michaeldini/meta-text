// Flashcard component to display cards for vocabulary review
// This component renders a list of flashcards based on the provided wordlist
// It uses Card components that flip to show the definition and context of each word

import React from 'react';
import { Box } from '@chakra-ui/react';
import Flashcard from './components/Flashcard';
import { Explanation } from 'types';
import { Alert } from 'components';

interface FlashCardsProps {
    flashcardItems: Explanation[];
}
export function FlashCards({ flashcardItems }: FlashCardsProps) {

    if (flashcardItems.length === 0) {
        return <Alert>No words yet. Define some words in the metatext editor to see them appear here.</Alert>;
    }

    return (
        <>
            <Box >
                {flashcardItems.map(item => (
                    <Flashcard
                        key={item.id}
                        word={item.words}
                        definition={item.explanation}
                        definition_in_context={item.explanation_in_context}
                        context={item.context}
                    />
                ))}
            </Box>
        </>
    );
};

export default FlashCards;
