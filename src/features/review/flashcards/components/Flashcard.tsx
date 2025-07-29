// Flashcard component for displaying a word and its definition using Chakra UI v3 Card primitives
import React, { useState } from 'react';
import { Card } from '@chakra-ui/react/card';
import { Stack } from '@chakra-ui/react/stack';
import FlashcardFront from './FlashcardFront';
import FlashcardBack from './FlashcardBack';
import { Box } from '@chakra-ui/react/box';

interface FlashcardProps {
    word: string;
    definition: string;
    definition_in_context: string;
    context: string;
}

export function Flashcard(props: FlashcardProps) {
    const { word, definition, definition_in_context, context } = props;
    const [flipped, setFlipped] = useState(false);

    return (
        <Card.Root variant="elevated" w="300px" p="0" >
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
        </Card.Root>
    );
}

export default Flashcard;
