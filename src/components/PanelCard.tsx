// Purpose: Display a single explanation panel, with controls (toggle view, minimize, close)
// and the content rendered via WordSelector to enable creating follow-up panels.

import React from 'react';
import { Box, Button, Flex, Spinner, Text, Link } from '@chakra-ui/react';
import WordSelector from './WordSelector';
import { Panel } from '../types/experiments';
import { Icon } from '@components/icons/Icon';
import {
    HiArrowsPointingOut,
    HiArrowsPointingIn,
} from 'react-icons/hi2';
import { TooltipButton } from '@components/TooltipButton';

export type PanelCardProps = {
    panel: Panel;
    onToggleView: (key: string) => void;
    onMinimize: (key: string, state?: boolean) => void;
    onClose: (key: string) => void;
    onSelection: (selection: string, fullText: string, range: { start: number; end: number }, sourcePanelKey: string) => void;
};

// Subcomponent: Header showing the source word and window controls
type PanelHeaderProps = {
    sourceWord?: string | null;
    minimized?: boolean;
    onMinimize: (state?: boolean) => void;
    onClose: () => void;
    headerBg?: string;
};

const PanelHeader: React.FC<PanelHeaderProps> = ({ sourceWord, minimized, onMinimize, onClose, headerBg }) => {
    return (
        <>
            <Flex align="center" justify="space-between" mb={2}>
                <Text fontWeight="bold" title={sourceWord ?? undefined} truncate bg={headerBg ? headerBg : 'transparent'} p="2">
                    {sourceWord}
                </Text>
                <Flex align="center">
                    {minimized ? (
                        <TooltipButton
                            label=""
                            tooltip="Maximize"
                            onClick={() => onMinimize(false)}
                            icon={<HiArrowsPointingOut />}
                            size="sm"
                        />
                    ) : (
                        <TooltipButton
                            label=""
                            tooltip="Minimize"
                            onClick={() => onMinimize(true)}
                            icon={<HiArrowsPointingIn />}
                            size="sm"
                        />
                    )}
                    <TooltipButton
                        label=""
                        tooltip="Close panel"
                        onClick={onClose}
                        icon={<Icon name="Close" />}
                        size="sm"
                    />
                </Flex>
            </Flex>
        </>
    );
};

// Subcomponent: Panel actions with external links and view toggle
type PanelActionsProps = {
    sourceWord?: string | null;
    viewMode: Panel['viewMode'];
    loading?: boolean;
    onToggleView: () => void;
};

const PanelActions: React.FC<PanelActionsProps> = ({ sourceWord, viewMode, loading, onToggleView }) => {
    const encodedQuery = encodeURIComponent(sourceWord ?? '');
    const wikiUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodedQuery}`;
    const googleUrl = `https://www.google.com/search?q=${encodedQuery}`;

    return (
        <Flex align="center" justify="flex-end" gap={2} mb={2}>
            <Flex gap={2}>
                <Link href={wikiUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="xs" variant="ghost" disabled={!sourceWord}>W</Button>
                </Link>
                <Link href={googleUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="xs" variant="ghost" disabled={!sourceWord}>G</Button>
                </Link>
            </Flex>
            <Button size="xs" colorScheme="blue" onClick={onToggleView} disabled={!!loading}>
                {viewMode === 'comprehensive' ? 'Show concise' : 'Show comprehensive'}
            </Button>
        </Flex>
    );
};

const PanelCard: React.FC<PanelCardProps> = ({ panel, onToggleView, onMinimize, onClose, onSelection }) => {
    const activeText = panel.viewMode === 'concise'
        ? (panel.concise ?? panel.comprehensive ?? '')
        : (panel.comprehensive ?? panel.concise ?? '');

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
            <PanelHeader
                sourceWord={panel.sourceWord}
                minimized={panel.minimized}
                onMinimize={(state) => onMinimize(panel.key, state)}
                onClose={() => onClose(panel.key)}
                headerBg={headerBg}
            />

            {!panel.minimized && (
                <PanelActions
                    sourceWord={panel.sourceWord}
                    viewMode={panel.viewMode}
                    loading={panel.loading}
                    onToggleView={() => onToggleView(panel.key)}
                />
            )}

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
