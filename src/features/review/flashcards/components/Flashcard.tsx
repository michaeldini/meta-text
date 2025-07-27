// Flashcard component for displaying a word and its definition using Chakra UI v3 Card primitives
import React, { useState } from 'react';
import { Card, Stack } from '@chakra-ui/react';
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
    // Optionally use styles if needed for custom styling
    // const theme = useTheme();
    // const styles = createFlashcardStyles(theme);

    return (
        <Card.Root width="320px" variant="elevated">
            <Card.Body gap="2">
                <Stack gap="2">
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
                </Stack>
            </Card.Body>
        </Card.Root>
    );
}

export default Flashcard;
