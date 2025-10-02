// Flashcard component to display cards for vocabulary review
// This component renders a list of flashcards based on the provided wordlist
// It uses Card components that flip to show the definition and context of each word

import React from 'react';
import { Wrap } from '@styles';
import Flashcard from './components/Flashcard';
import { Explanation } from '@mtypes/review';
import { EmptyState } from '@components/ui';

interface FlashCardsProps {
    flashcardItems: Explanation[];
}
export function FlashCards({ flashcardItems }: FlashCardsProps) {

    if (flashcardItems.length === 0) {
        return <EmptyState title="No Flashcards Yet" icon="😕" description="Explain a word to see it here." />;
    }

    return (
        <>
            <Wrap >
                {flashcardItems.map(item => (
                    <Flashcard
                        key={item.id}
                        word={item.words}
                        definition={item.explanation}
                        definition_in_context={item.explanation_in_context}
                        context={item.context}
                    />
                ))}
            </Wrap>
        </>
    );
};

export default FlashCards;
