// Front of a flashcard component that displays a word and allows flipping to see its definition

import React from 'react';
import { Card } from '@chakra-ui/react/card';
import { Button } from '@chakra-ui/react/button';
import { Text } from '@chakra-ui/react/text';

interface FlashcardFrontProps {
    word: string;
    setFlipped: (flipped: boolean) => void;
}

export function FlashcardFront(props: FlashcardFrontProps) {
    const { word, setFlipped } = props;
    return (
        <Button
            onClick={() => setFlipped(true)}
            fontSize="2xl"
            fontWeight="bold"
            borderRadius="md"
            width="100%"
            height="auto"
        >
            <Card.Body gap="0">
                <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                    {word}
                </Text>
            </Card.Body>
        </Button>
    );
}

export default FlashcardFront;
