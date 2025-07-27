// Back of a flashcard component that displays the definition and context of a word

import React from 'react';
import { Card, Button, Text, Stack, Box } from '@chakra-ui/react';
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
        <Card.Body display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="200px" gap="4">
            <Button
                variant="ghost"
                width="100%"
                height="auto"
                onClick={() => setFlipped(false)}
                fontSize="lg"
                fontWeight="bold"
                borderRadius="md"
                _hover={{ bg: 'gray.100' }}
                mb="2"
            >
                <Text fontSize="xl" fontWeight="bold" color="gray.600" textAlign="center">
                    {word}
                </Text>
                <Text fontSize="md" mt="1" textAlign="center">
                    {definition}
                </Text>
            </Button>
            <Stack direction="row" gap="4" mt="2">
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
            </Stack>
        </Card.Body>
    );
}

export default FlashcardBack;
