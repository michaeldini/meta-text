// Back of a flashcard component that displays the definition and context of a word

import React from 'react';
import { Card, Button, Text, Box, Stack } from '@chakra-ui/react';
import { HiBars3, HiQuestionMarkCircle } from 'react-icons/hi2';
import InfoButton from './InfoPopoverButton';

interface FlashcardBackProps {
    word: string;
    definition: string;
    definition_in_context: string;
    context: string;
    setFlipped: (flipped: boolean) => void;
}

export function FlashcardBack(props: FlashcardBackProps) {
    const {
        word,
        definition,
        definition_in_context,
        context,
        setFlipped
    } = props;
    // Highlight the word in context using <mark>
    const highlightedText: string = context.replace(new RegExp(`(${word})`, 'gi'), '<mark>$1</mark>');

    return (
        <>
            <Card.Body gap="2">
                <Button
                    variant="solid"
                    width="100%"
                    height="auto"
                    onClick={() => setFlipped(false)}
                    fontSize="lg"
                    fontWeight="bold"
                    borderRadius="md"
                    mb="2"
                >
                    Go back
                </Button>
                <Card.Title>
                    {word}
                </Card.Title>
                <Card.Description>
                    {definition}
                </Card.Description>
            </Card.Body>
            <Card.Footer justifyContent="flex-end">
                <InfoButton
                    icon={<HiBars3 />}
                    dialogId="info-dialog"
                    title="Definition In Context"
                    word={word}
                    content={definition_in_context}
                />
                <InfoButton
                    icon={<HiQuestionMarkCircle />}
                    dialogId="context-dialog"
                    title="Context"
                    word={word}
                    content={<Box as="span" dangerouslySetInnerHTML={{ __html: highlightedText }} />}
                />
            </Card.Footer>
        </>
    );
}

export default FlashcardBack;
