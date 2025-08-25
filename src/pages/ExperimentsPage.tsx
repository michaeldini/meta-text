// ExperimentsPage: Page with right side panel, main content, and prompt input at bottom.

import React, { useState } from 'react';
import { Box, Flex, Input, Button, Text, Spinner } from '@chakra-ui/react';
import { explain2, ExplanationResponse2 } from '../services/aiService';

const TESTING_TEXT = "Submit a prompt to begin";

const ExperimentsPage: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    // Main content text shown in the WordWrapper. Starts with TESTING_TEXT but will
    // be replaced with explain2 results when the user submits a prompt.
    const [mainText, setMainText] = useState(TESTING_TEXT);
    const [mainLoading, setMainLoading] = useState(false);
    const [mainError, setMainError] = useState<string | null>(null);
    // State to collect words clicked by the user
    // Store clicked words along with their fetched explanations and loading/error state.
    interface ClickedWord {
        word: string;
        explanation?: ExplanationResponse2;
        loading?: boolean;
        error?: string | null;
    }

    const [clickedWords, setClickedWords] = useState<ClickedWord[]>([]);

    // Adds the clicked word to state
    // Avoid duplicates: only append if the word isn't already present
    const handleWordClick = (word: string, fullTextContext: string) => {
        console.log('[ExperimentsPage] handleWordClick called for', word);

        // If we already have this word and it's either loading or already has an explanation, skip.
        const existing = clickedWords.find(p => p.word === word);
        if (existing) {
            if (existing.loading) {
                console.log('[ExperimentsPage] word already loading, skipping fetch for', word);
                return;
            }
            if (existing.explanation) {
                console.log('[ExperimentsPage] word already has explanation, skipping fetch for', word);
                return;
            }
        }

        // Add a placeholder entry with loading=true only if it doesn't already exist.
        setClickedWords(prev => {
            const has = prev.find(p => p.word === word);
            if (has) return prev;
            console.log('[ExperimentsPage] adding placeholder for', word);
            return [...prev, { word, loading: true, error: null }];
        });

        // Fetch explanation and update the corresponding entry when it resolves.
        (async () => {
            console.log('[ExperimentsPage] calling explain2 for', word);
            try {
                // Build a tighter context window around the clicked word
                const MAX_CONTEXT = 600;
                const WINDOW = 200;
                const safeText = fullTextContext ?? '';
                let idx = -1;
                try {
                    const wordRegex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\b`, 'i');
                    const match = safeText.match(wordRegex);
                    idx = match && match.index !== undefined ? match.index : -1;
                } catch {
                    idx = safeText.toLowerCase().indexOf(word.toLowerCase());
                }
                let contextSlice = safeText;
                if (idx >= 0) {
                    const leftBoundary = (() => {
                        const punct = safeText.lastIndexOf('.', idx);
                        const q = safeText.lastIndexOf('?', idx);
                        const ex = safeText.lastIndexOf('!', idx);
                        const nl = safeText.lastIndexOf('\n', idx);
                        return Math.max(punct, q, ex, nl) + 1 || 0;
                    })();
                    const rightBoundary = (() => {
                        const punct = safeText.indexOf('.', idx);
                        const q = safeText.indexOf('?', idx);
                        const ex = safeText.indexOf('!', idx);
                        const nl = safeText.indexOf('\n', idx);
                        const ends = [punct, q, ex, nl].filter(n => n !== -1);
                        return ends.length ? Math.min(...ends) + 1 : safeText.length;
                    })();
                    contextSlice = safeText.slice(leftBoundary, rightBoundary);
                    if (contextSlice.trim().length < 20) {
                        const start = Math.max(0, idx - WINDOW);
                        const end = Math.min(safeText.length, idx + word.length + WINDOW);
                        contextSlice = safeText.slice(start, end);
                    }
                } else {
                    contextSlice = safeText.slice(0, MAX_CONTEXT);
                }
                if (contextSlice.length > MAX_CONTEXT) {
                    contextSlice = contextSlice.slice(0, MAX_CONTEXT);
                }

                const res = await explain2({ word, context: contextSlice });
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
    const handlePromptSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = prompt.trim();
        if (!trimmed) return;
        console.log('[ExperimentsPage] Prompt submitted:', trimmed);

        setMainLoading(true);
        setMainError(null);

        try {
            const res = await explain2({ word: trimmed, context: trimmed });
            console.log('[ExperimentsPage] explain2 result for prompt:', res);
            // Combine the response into a single text blob to render inside WordWrapper.
            const combined = `${res.word}\n\nConcise: ${res.concise}\n\nComprehensive: ${res.comprehensive}`;
            setMainText(combined);
            setPrompt('');
        } catch (err: any) {
            console.error('[ExperimentsPage] explain2 failed for prompt', err);
            setMainError(err?.message ?? 'Failed to fetch explanation');
        } finally {
            setMainLoading(false);
        }
    };

    // Component that wraps each word in a Chakra Box (rendered as a span)
    const WordWrapper: React.FC<{
        text: string;
        onWordClick?: (word: string, contextText: string) => void;
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
                                onClick={() => onWordClick?.(part, text)}
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
        <Flex direction="column">
            {/* Main content and side panel */}
            <Flex flex="1" overflow="hidden">
                {/* Main content area */}
                <Box flex="1" p={6} overflowY="auto">
                    {mainLoading ? (
                        <Flex align="center" justify="center" h="100%">
                            <Spinner />
                        </Flex>
                    ) : mainError ? (
                        <Text color="red.500">{mainError}</Text>
                    ) : (
                        <WordWrapper
                            text={mainText}
                            onWordClick={handleWordClick}
                        />
                    )}
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


