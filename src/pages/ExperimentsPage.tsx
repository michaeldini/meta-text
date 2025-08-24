// ExperimentsPage: Page with right side panel, main content, and prompt input at bottom.

import React, { useState } from 'react';
import { Box, Flex, Input, Button, Text } from '@chakra-ui/react';

const TESTING_TEXT = "This is a test. Here are some big words to explain: boondoggle, flabbergasted, and sesquipedalian.";

const ExperimentsPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    // State to collect words clicked by the user
    const [clickedWords, setClickedWords] = useState<string[]>([]);

    // Adds the clicked word to state (instead of logging to console)
    // Avoid duplicates: only append if the word isn't already present
    const handleWordClick = (word: string) => {
        setClickedWords(prev => (prev.includes(word) ? prev : [...prev, word]));
    };

    // Handles prompt submission
    const handlePromptSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Prompt submitted:", prompt);
        setPrompt('');
    };

    // Component that wraps each word in a Chakra Box (rendered as a span)
    const WordWrapper: React.FC<{
        text: string;
        onWordClick?: (word: string) => void;
    }> = ({ text, onWordClick }) => {
        // Capture words, whitespace, and punctuation separately
        const parts = Array.from(text.matchAll(/(\w+|\s+|[^\s\w]+)/g)).map(m => m[0]);

        return (
            <Text as="span">
                {parts.map((part, i) => {
                    // If part is a word (letters/numbers/underscore), make it clickable
                    if (/^\w+$/.test(part)) {
                        return (
                            <Box
                                px={0}
                                mx={0}
                                key={i}
                                as="span"
                                cursor="pointer"
                                onClick={() => onWordClick?.(part)}
                                _hover={{ background: 'gray.600' }}
                                display="inline-block"
                            >
                                {part}
                            </Box>
                        );
                    }

                    // Otherwise render punctuation/whitespace as-is
                    return (
                        <Box as="span" key={i} display="inline">
                            {part}
                        </Box>
                    );
                })}
            </Text>
        );
    };

    return (
        <Flex direction="column" h="100vh">
            {/* Main content and side panel */}
            <Flex flex="1" overflow="hidden">
                {/* Main content area */}
                <Box flex="1" p={6} overflowY="auto">
                    <WordWrapper
                        text={TESTING_TEXT}
                        onWordClick={handleWordClick}
                    />
                </Box>
                {/* Side panel */}
                <Box w={{ base: "full", md: "350px" }} borderLeft="1px solid" borderColor="gray.200" p={6} boxShadow="md">
                    <Text fontSize="lg" fontWeight="bold" mb={3}>Clicked words</Text>
                    {clickedWords.length === 0 ? (
                        <Text color="gray.500">No words clicked yet. Click a word in the main pane.</Text>
                    ) : (
                        <Box as="ul" pl={4} maxH="60vh" overflowY="auto">
                            {clickedWords.map((w, i) => (
                                <Box as="li" key={i} py={1}>
                                    <Text as="span" fontWeight="semibold">{w}</Text>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            </Flex>
            {/* Prompt input at bottom */}
            <Box as="form" onSubmit={handlePromptSubmit} p={4} borderTop="1px solid" borderColor="gray.200">
                <Flex>
                    <Input
                        placeholder="Enter your prompt..."
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        mr={2}
                    />
                    <Button type="submit" colorScheme="blue" disabled={!prompt.trim()}>
                        Send
                    </Button>
                </Flex>
            </Box>
        </Flex>
    );
};

export default ExperimentsPage;


