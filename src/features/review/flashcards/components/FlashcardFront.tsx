// Front of a flashcard component that displays a word and allows flipping to see its definition

import React from 'react';
import { Card } from '@chakra-ui/react/card';
import { Button } from '@chakra-ui/react/button';
import { Prose } from 'components/ui';

interface FlashcardFrontProps {
    word: string;
    setFlipped: (flipped: boolean) => void;
}

export function FlashcardFront(props: FlashcardFrontProps) {
    const { word, setFlipped } = props;
    return (
        <Card.Body gap="0">
            <Button
                onClick={() => setFlipped(true)}
                fontSize="2xl"
                fontWeight="bold"
                borderRadius="md"
                width="100%"
                height="auto"
            >
                <Prose fontSize="2xl" fontWeight="bold" textAlign="center">
                    {word}
                </Prose>
            </Button>
        </Card.Body>
    );
}

export default FlashcardFront;
