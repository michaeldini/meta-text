// Front of a flashcard component that displays a word and allows flipping to see its definition

import React from 'react';
import { Card, Button, Text } from '@chakra-ui/react';

interface FlashcardFrontProps {
    word: string;
    setFlipped: (flipped: boolean) => void;
}

export function FlashcardFront(props: FlashcardFrontProps) {
    const { word, setFlipped } = props;
    return (
        <Card.Body display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="200px">
            <Button
                variant="ghost"
                width="100%"
                height="100%"
                onClick={() => setFlipped(true)}
                fontSize="2xl"
                fontWeight="bold"
                borderRadius="md"
                _hover={{ bg: 'gray.100' }}
            >
                <Text fontSize="2xl" fontWeight="bold" textAlign="center">
                    {word}
                </Text>
            </Button>
        </Card.Body>
    );
}

export default FlashcardFront;
