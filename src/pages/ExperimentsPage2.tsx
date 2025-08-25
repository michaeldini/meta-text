// ExperimentsPage v2
// Purpose: Two-step exploration UI.
// 1) Show only an input initially. On submit, fetch a response and hide the input.
// 2) Render the response as clickable words inside a container.
// 3) Clicking any word appends a new container to the right with that word's explanation.
// 4) Repeat: every click adds another container. All containers are arranged in a horizontal flex row.

import React, { useState } from 'react';
import { Box, Flex, Wrap, Input, Button, Text, Spinner } from '@chakra-ui/react';
// Switch to the mock during development to avoid real API calls.
// For production, change this import back to: '../services/aiService'
// import { explain2, ExplanationResponse2 } from '../services/aiService.mock';
import { explain2, ExplanationResponse2 } from '../services/aiService';

type Panel = {
    key: string;
    sourceWord: string; // the word that produced this panel
    loading?: boolean;
    error?: string | null;
    concise?: string;
    comprehensive?: string;
    viewMode: 'comprehensive' | 'concise';
};

const ExperimentsPage2: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [hasStarted, setHasStarted] = useState(false);
    const [panels, setPanels] = useState<Panel[]>([]);
    const [initialLoading, setInitialLoading] = useState(false);
    const [initialError, setInitialError] = useState<string | null>(null);

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
                                _hover={{ background: 'gray.700' }}
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

    // Step 1: Initial query -> creates the first panel
    const handlePromptSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = prompt.trim();
        if (!trimmed) return;

        setInitialError(null);
        setInitialLoading(true);

        try {
            const res = await explain2({ word: trimmed });
            const panel: Panel = {
                key: `panel-${Date.now()}-0`,
                sourceWord: res.word ?? trimmed,
                loading: false,
                concise: res.concise,
                comprehensive: res.comprehensive,
                viewMode: 'comprehensive', // prefer comprehensive initially
            };
            setPanels([panel]);
            setHasStarted(true); // hide input after first successful response
            setPrompt('');
        } catch (err: any) {
            setInitialError(err?.message ?? 'Failed to fetch explanation');
        } finally {
            setInitialLoading(false);
        }
    };

    // Step 2: Clicking a word -> append a new panel
    const appendPanelForWord = async (word: string) => {
        const key = `panel-${Date.now()}-${panels.length}`;
        // optimistic placeholder panel
        setPanels(prev => [
            ...prev,
            { key, sourceWord: word, loading: true, error: null, viewMode: 'comprehensive' },
        ]);

        try {
            const res = await explain2({ word });
            setPanels(prev => prev.map(p => p.key === key
                ? {
                    ...p,
                    loading: false,
                    concise: res.concise,
                    comprehensive: res.comprehensive,
                    viewMode: 'comprehensive',
                }
                : p
            ));
        } catch (err: any) {
            setPanels(prev => prev.map(p => p.key === key
                ? { ...p, loading: false, error: err?.message ?? 'Failed to fetch explanation' }
                : p
            ));
        }
    };

    const togglePanelView = (key: string) => {
        setPanels(prev => prev.map(p => p.key === key
            ? { ...p, viewMode: p.viewMode === 'comprehensive' ? 'concise' : 'comprehensive' }
            : p
        ));
    };

    return (
        <Flex direction="column" h="100%" p={4}>
            {/* Step 1: Only input visible before first successful response */}
            {!hasStarted && (
                <Box as="form" onSubmit={handlePromptSubmit} w="100%" maxW="960px" mx="auto">
                    <Flex gap={2} align="center" borderBottom="1px solid" borderColor="gray.200">
                        <Input
                            placeholder="Enter your prompt..."
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            disabled={initialLoading}
                        />
                        <Button type="submit" colorScheme="blue" disabled={!prompt.trim() || initialLoading}>
                            {initialLoading ? <Spinner size="sm" /> : 'Send'}
                        </Button>
                    </Flex>
                    {initialError && (
                        <Text mt={2} color="red.400" fontSize="sm">{initialError}</Text>
                    )}
                </Box>
            )}

            {/* Step 2+: Panels row. Appears after first successful response. */}
            {hasStarted && (
                <Box mt={2} overflowX="auto">
                    <Flex direction="row" gap={4} align="flex-start" minH="200px" pb={2}>
                        {panels.map((panel) => (
                            <Box
                                key={panel.key}
                                border="1px solid"
                                borderColor="gray.200"
                                borderRadius="md"
                                p={4}
                                minW={{ base: '280px', md: '360px' }}
                                maxW={{ base: '90vw', md: '480px' }}
                                bg="gray.800"
                                color="gray.100"
                                boxShadow="sm"
                            >
                                <Flex align="center" justify="space-between" gap={2} mb={2}>
                                    <Text fontWeight="bold" title={panel.sourceWord}>
                                        {panel.sourceWord}
                                    </Text>
                                    <Button
                                        size="xs"
                                        colorScheme="blue"
                                        onClick={() => togglePanelView(panel.key)}
                                        disabled={panel.loading}
                                    >
                                        {panel.viewMode === 'comprehensive' ? 'Show concise' : 'Show comprehensive'}
                                    </Button>
                                </Flex>

                                {panel.loading && (
                                    <Flex align="center" justify="center" minH="80px">
                                        <Spinner />
                                    </Flex>
                                )}

                                {panel.error && (
                                    <Text color="red.300">{panel.error}</Text>
                                )}

                                {!panel.loading && !panel.error && (
                                    (() => {
                                        const activeText = panel.viewMode === 'concise'
                                            ? (panel.concise ?? panel.comprehensive ?? '')
                                            : (panel.comprehensive ?? panel.concise ?? '');
                                        return (
                                            <WordWrapper text={activeText} onWordClick={appendPanelForWord} />
                                        );
                                    })()
                                )}
                            </Box>
                        ))}
                    </Flex>
                </Box>
            )}
        </Flex>
    );
};

export default ExperimentsPage2;


