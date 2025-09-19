import { HiXMark } from 'react-icons/hi2';
// Purpose: Display a single explanation panel, with controls (toggle view, minimize, close)
// and the content rendered via WordSelector to enable creating follow-up panels.

import React from 'react';
import { Box, Button, Row, Text, Link } from '@styles';
import WordSelector from './WordSelector';
import { Panel } from '@mtypes/experiments';
import { HiArrowsPointingOut, HiArrowsPointingIn } from 'react-icons/hi2';
import { TooltipButton } from '@components/ui/TooltipButton';

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

export function PanelHeader({ sourceWord, minimized, onMinimize, onClose, headerBg }: PanelHeaderProps) {
    return (
        <>
            <Row>
                <Text title={sourceWord ?? undefined} css={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', background: headerBg ?? 'transparent', padding: 8 }}>
                    {sourceWord}
                </Text>
                <Row>
                    {minimized ? (
                        <TooltipButton
                            label=""
                            tooltip="Maximize"
                            onClick={() => onMinimize(false)}
                            icon={<HiArrowsPointingOut />}
                        />
                    ) : (
                        <TooltipButton
                            label=""
                            tooltip="Minimize"
                            onClick={() => onMinimize(true)}
                            icon={<HiArrowsPointingIn />}
                        />
                    )}
                    <TooltipButton
                        label=""
                        tooltip="Close panel"
                        onClick={onClose}
                        icon={<HiXMark />}
                    />
                </Row>
            </Row>
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

export function PanelActions({ sourceWord, viewMode, loading, onToggleView }: PanelActionsProps) {
    const encodedQuery = encodeURIComponent(sourceWord ?? '');
    const wikiUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodedQuery}`;
    const googleUrl = `https://www.google.com/search?q=${encodedQuery}`;

    return (
        <Row >
            <Row>
                <Link href={wikiUrl} target="_blank" rel="noopener noreferrer">
                    <Button css={{ background: 'transparent', padding: '4px 6px' }} disabled={!sourceWord}>W</Button>
                </Link>
                <Link href={googleUrl} target="_blank" rel="noopener noreferrer">
                    <Button css={{ background: 'transparent', padding: '4px 6px' }} disabled={!sourceWord}>G</Button>
                </Link>
            </Row>
            <Button tone="primary" onClick={onToggleView} disabled={!!loading} css={{ padding: '6px 10px' }}>
                {viewMode === 'comprehensive' ? 'Show concise' : 'Show comprehensive'}
            </Button>
        </Row>
    );
};

export function PanelCard({ panel, onToggleView, onMinimize, onClose, onSelection }: PanelCardProps) {
    const activeText = panel.viewMode === 'concise'
        ? (panel.concise ?? panel.comprehensive ?? '')
        : (panel.comprehensive ?? panel.concise ?? '');

    const headerBg = panel.linkColor ? panel.linkColor : undefined;
    const activeHighlights = panel.highlights?.filter(h => h.viewMode === panel.viewMode);

    const leftBorderProps: React.CSSProperties | undefined = panel.linkColor
        ? { borderLeft: '6px solid', borderLeftColor: panel.linkColor }
        : undefined;

    return (
        <Box
            style={{
                border: '1px solid',
                borderColor: '#374151',
                borderRadius: 8,
                padding: 16,
                minWidth: 280,
                maxWidth: 480,
                boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
                ...(leftBorderProps || {}),
            }}
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
                <Row>
                    <div>…</div>
                </Row>
            )}

            {!panel.minimized && panel.error && (
                <Text css={{}}>{panel.error}</Text>
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
