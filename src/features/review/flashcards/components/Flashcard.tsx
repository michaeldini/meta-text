// Flashcard component for displaying a word and its definition using Chakra UI v3 Card primitives
import React, { useState } from 'react';
import { styled } from '@styles';
import FlashcardFront from './FlashcardFront';
import FlashcardBack from './FlashcardBack';


const CardRoot = styled('div', {
    width: 300,
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
});

export interface FlashcardProps {
    word: string;
    definition: string;
    definition_in_context: string;
    context: string;
}

export function Flashcard(props: FlashcardProps) {
    const { word, definition, definition_in_context, context } = props;
    const [flipped, setFlipped] = useState(false);

    return (
        <CardRoot>
            {/* Front and Back are conditionally rendered based on flipped state */}
            {!flipped ? (
                <FlashcardFront word={word} setFlipped={setFlipped} />
            ) : (
                <FlashcardBack
                    word={word}
                    definition={definition}
                    definition_in_context={definition_in_context}
                    context={context}
                    setFlipped={setFlipped}
                />
            )}
        </CardRoot>
    );
}

export default Flashcard;
