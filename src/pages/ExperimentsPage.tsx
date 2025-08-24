// ExperimentsPage: Page with right side panel, main content, and prompt input at bottom.

import React, { useState } from 'react';
import { Box, Flex, Input, Button, Text, Spinner } from '@chakra-ui/react';
import { explain2, ExplanationResponse2 } from '../services/aiService';

const TESTING_TEXT = "This is a test. Here are some big words to explain: boondoggle, flabbergasted, and sesquipedalian.";

const ExperimentsPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    // State to collect words clicked by the user
    // Store clicked words along with their fetched explanations and loading/error state.
    interface ClickedWord {
        word: string;
        explanation?: ExplanationResponse2;
        loading?: boolean;
        error?: string | null;
    }

    const [clickedWords, setClickedWords] = useState<ClickedWord[]>([]);

    // Adds the clicked word to state (instead of logging to console)
    // Avoid duplicates: only append if the word isn't already present
    const handleWordClick = (word: string) => {
        console.log('[ExperimentsPage] handleWordClick called for', word);
        // Add a placeholder entry with loading=true only if it doesn't already exist.
        let shouldFetch = false;
        setClickedWords(prev => {
            const existing = prev.find(p => p.word === word);
            if (existing) return prev;
            shouldFetch = true;
            console.log('[ExperimentsPage] adding placeholder for', word);
            return [...prev, { word, loading: true, error: null }];
        });

        if (!shouldFetch) return;

        // Fetch explanation and update the corresponding entry when it resolves.
        (async () => {
            console.log('[ExperimentsPage] calling explain2 for', word);
            try {
                const res = await explain2({ word });
                console.log('[ExperimentsPage] explain2 success for', word, res);
                setClickedWords(prev => prev.map(p => p.word === word ? { ...p, explanation: res, loading: false } : p));
            } catch (err: any) {
                console.error('[ExperimentsPage] explain2 failed for', word, err);
                const msg = err?.message ?? 'Failed to fetch explanation';
                setClickedWords(prev => prev.map(p => p.word === word ? { ...p, error: msg, loading: false } : p));
            }
        })();
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
                <Box borderLeft="1px solid" borderColor="gray.200" p={6} boxShadow="md">
                    <Text fontSize="lg" fontWeight="bold" mb={3}>Clicked words</Text>
                    {clickedWords.length === 0 ? (
                        <Text color="gray.500">No words clicked yet. Click a word in the main pane.</Text>
                    ) : (
                        <Box as="ul" pl={4} maxH="60vh" maxW="40vw" overflowY="auto">
                            {clickedWords.map((item, i) => (
                                <Box as="li" key={i} py={2}>
                                    <Flex align="center" gap={2}>
                                        <Text as="span" fontWeight="semibold">{item.word}</Text>
                                        {item.loading && <Spinner size="xs" />}
                                        {item.error && <Text color="red.500" fontSize="sm">{item.error}</Text>}
                                    </Flex>
                                    {item.explanation && (
                                        <Box mt={2} pl={2}>
                                            <Text fontSize="sm" fontWeight="semibold">Concise</Text>
                                            <Text fontSize="sm">{item.explanation.concise}</Text>
                                            <Text mt={2} fontSize="sm" fontWeight="semibold">Comprehensive</Text>
                                            <Text fontSize="sm">{item.explanation.comprehensive}</Text>
                                        </Box>
                                    )}
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


