import { HiBars3, HiQuestionMarkCircle } from 'react-icons/hi2';
// Back of a flashcard component that displays the definition and context of a word

import React from 'react';
import { Card, Button, Text, Box, Stack, IconButton, Highlight } from '@chakra-ui/react';
import { SimpleDrawer, Tooltip } from '@components/ui';

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
                    <Card.Title>
                        {word}
                    </Card.Title>
                </Button>
                <Card.Description >
                    {definition}
                </Card.Description>
            </Card.Body>

            <Card.Footer justifyContent="flex-end">
                {/* Definition In Context */}
                <SimpleDrawer
                    triggerButton={
                        <Tooltip content="Definition In Context">
                            <IconButton
                                aria-label={`open-definition-${word}`}
                                color="secondary"
                            >
                                <HiBars3 />
                            </IconButton>
                        </Tooltip>
                    }
                    title="Definition In Context"
                >
                    <Box p="4">
                        <Text fontWeight="bold">Word: {word}</Text>
                        <Text mt="2">{definition_in_context}</Text>
                    </Box>
                </SimpleDrawer>

                {/* Context */}
                <SimpleDrawer
                    triggerButton={
                        <Tooltip content="Context">
                            <IconButton
                                aria-label={`open-context-${word}`}
                                color="secondary"
                            >
                                <HiQuestionMarkCircle />
                            </IconButton>
                        </Tooltip>
                    }
                    title="Context"
                    size="xl"
                >
                    <Highlight query={word}
                        styles={{ px: "0.5", bg: "orange.subtle", color: "orange.fg" }}
                    >{context}</Highlight>
                </SimpleDrawer>
            </Card.Footer>
        </>
    );
}

export default FlashcardBack;
