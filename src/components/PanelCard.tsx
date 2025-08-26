// Purpose: Display a single explanation panel, with controls (toggle view, minimize, close)
// and the content rendered via WordSelector to enable creating follow-up panels.

import React from 'react';
import { Box, Button, Flex, Spinner, Text, Link } from '@chakra-ui/react';
import WordSelector from './WordSelector';
import { Panel } from '../types/experiments';

export type PanelCardProps = {
    panel: Panel;
    onToggleView: (key: string) => void;
    onMinimize: (key: string, state?: boolean) => void;
    onClose: (key: string) => void;
    onSelection: (selection: string, fullText: string, range: { start: number; end: number }, sourcePanelKey: string) => void;
};

const PanelCard: React.FC<PanelCardProps> = ({ panel, onToggleView, onMinimize, onClose, onSelection }) => {
    const activeText = panel.viewMode === 'concise'
        ? (panel.concise ?? panel.comprehensive ?? '')
        : (panel.comprehensive ?? panel.concise ?? '');
    const encodedQuery = encodeURIComponent(panel.sourceWord ?? '');
    const wikiUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodedQuery}`;
    const googleUrl = `https://www.google.com/search?q=${encodedQuery}`;

    const headerBg = panel.linkColor ? panel.linkColor : undefined;
    const activeHighlights = panel.highlights?.filter(h => h.viewMode === panel.viewMode);

    const leftBorderProps = panel.linkColor
        ? { borderLeft: '6px solid', borderLeftColor: panel.linkColor }
        : undefined;

    return (
        <Box
            border="1px solid"
            borderColor="gray.700"
            borderRadius="md"
            p={4}
            minW={{ base: '280px', md: '360px' }}
            maxW={{ base: '90vw', md: '480px' }}
            bg="gray.800"
            color="gray.100"
            boxShadow="lg"
            {...leftBorderProps}
        >
            <Flex align="center" justify="space-between" gap={2} mb={2} bg={headerBg ? headerBg : 'transparent'} borderRadius="sm" px={headerBg ? 2 : 0} py={headerBg ? 1 : 0}>
                <Flex align="center" gap={3} minW={0}>
                    <Text fontWeight="bold" title={panel.sourceWord} truncate>
                        {panel.sourceWord}
                    </Text>
                    <Flex gap={2} flexShrink={0}>
                        <Link href={wikiUrl} target="_blank" rel="noopener noreferrer">
                            <Button size="xs" variant="ghost" disabled={!panel.sourceWord}>
                                W
                            </Button>
                        </Link>
                        <Link href={googleUrl} target="_blank" rel="noopener noreferrer">
                            <Button size="xs" variant="ghost" disabled={!panel.sourceWord}>
                                G
                            </Button>
                        </Link>
                    </Flex>
                </Flex>
                <Flex gap={2} align="center">
                    {panel.minimized ? (
                        <>
                            <Button size="xs" onClick={() => onMinimize(panel.key, false)}>Maximize</Button>
                            <Button size="xs" colorScheme="red" onClick={() => onClose(panel.key)}>Close</Button>
                        </>
                    ) : (
                        <>
                            <Button size="xs" colorScheme="blue" onClick={() => onToggleView(panel.key)} disabled={panel.loading}>
                                {panel.viewMode === 'comprehensive' ? 'Show concise' : 'Show comprehensive'}
                            </Button>
                            <Button size="xs" onClick={() => onMinimize(panel.key, true)}>Minimize</Button>
                            <Button size="xs" colorScheme="red" onClick={() => onClose(panel.key)}>Close</Button>
                        </>
                    )}
                </Flex>
            </Flex>

            {!panel.minimized && panel.loading && (
                <Flex align="center" justify="center" minH="80px">
                    <Spinner />
                </Flex>
            )}

            {!panel.minimized && panel.error && (
                <Text color="red.300">{panel.error}</Text>
            )}

            {!panel.minimized && !panel.loading && !panel.error && (
                <WordSelector
                    text={activeText}
                    onSelection={(s, t, r) => onSelection(s, t, r, panel.key)}
                    highlights={activeHighlights}
                />
            )}
        </Box>
    );
};

export default PanelCard;
