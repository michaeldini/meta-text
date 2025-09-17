// Purpose: Two-step exploration UI composed from smaller components.
// - PromptBar: shown when there are no panels yet, submits the initial prompt.
// - PanelsRow: renders PanelCard components side by side.
// - PanelCard: shows explanation text via WordSelector; selecting text spawns a new panel.
// - textContext utils: builds a tight context slice when the user makes a selection.


import React, { useRef, useState } from 'react';
import { Box, Flex } from '@styles';

// Switch to the mock during development to avoid real API calls.
// For production, change this import back to: '../services/aiService'
import { explain2, ExplanationResponse2 } from '../services/aiService.mock';
// import { explain2, ExplanationResponse2 } from '../services/aiService';
import { buildContextSlice } from '../utils/textContext';
import { Panel } from '../types/experiments';
import PromptBar from '../features/russion-dolls/components/PromptBar';
import PanelsRow from '../features/russion-dolls/components/PanelsRow';

export function RussianDollsPage() {
    const [prompt, setPrompt] = useState('');
    const [panels, setPanels] = useState<Panel[]>([]);
    const [initialLoading, setInitialLoading] = useState(false);
    const [initialError, setInitialError] = useState<string | null>(null);
    const hasPanels = panels.length > 0;

    // distinct color generator using golden ratio to spread hues
    const hueRef = useRef(0.12); // initial hue [0,1)
    const nextColor = () => {
        const GOLDEN_RATIO_CONJUGATE = 0.61803398875;
        hueRef.current = (hueRef.current + GOLDEN_RATIO_CONJUGATE) % 1;
        const h = Math.round(hueRef.current * 360);
        // soft pastel with slight transparency so it layers nicely on dark bg
        return `hsla(${h}, 70%, 60%, 0.35)`;
    };


    // Step 1: Initial query -> creates the first panel
    const handlePromptSubmit = async (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) return;
        setInitialError(null);
        setInitialLoading(true);
        try {
            const res: ExplanationResponse2 = await explain2({ word: trimmed, context: trimmed });
            const panel: Panel = {
                key: `panel-${Date.now()}-0`,
                sourceWord: res.word ?? trimmed,
                loading: false,
                concise: res.concise,
                comprehensive: res.comprehensive,
                viewMode: 'concise',
                minimized: false,
                linkColor: undefined,
            };
            setPanels([panel]);
            setPrompt('');
        } catch {
            setInitialError('Failed to fetch explanation');
        } finally {
            setInitialLoading(false);
        }
    };

    // Step 2: Mouse selection (multi-word) -> append a new panel
    const appendPanelForSelection = async (selection: string, fullTextContext: string, range?: { start: number; end: number }, sourcePanelKey?: string) => {
        const contextSlice = buildContextSlice(selection, fullTextContext);
        const color = nextColor();

        const key = `panel-${Date.now()}-${panels.length}`;
        // optimistic placeholder panel
        setPanels(prev => {
            const newPanel: Panel = {
                key,
                sourceWord: selection,
                loading: true,
                error: null,
                viewMode: 'concise',
                minimized: false,
                linkColor: color,
                parentKey: sourcePanelKey,
            };
            const updated: Panel[] = [...prev, newPanel];
            if (sourcePanelKey && range) {
                return updated.map(p => p.key === sourcePanelKey
                    ? {
                        ...p,
                        highlights: [
                            ...(p.highlights ?? []),
                            { start: range.start, end: range.end, color, viewMode: p.viewMode },
                        ],
                    }
                    : p
                );
            }
            return updated;
        });

        try {
            const res = await explain2({ word: selection, context: contextSlice });
            setPanels(prev => prev.map(p => p.key === key
                ? {
                    ...p,
                    loading: false,
                    concise: res.concise,
                    comprehensive: res.comprehensive,
                    // Preserve whatever the user had selected while loading (defaults to 'concise').
                    viewMode: p.viewMode,
                    linkColor: p.linkColor ?? color,
                }
                : p
            ));
        } catch {
            setPanels(prev => prev.map(p => p.key === key
                ? { ...p, loading: false, error: 'Failed to fetch explanation' }
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

    const toggleMinimizePanel = (key: string, state?: boolean) => {
        setPanels(prev => prev.map(p => p.key === key
            ? { ...p, minimized: typeof state === 'boolean' ? state : !p.minimized }
            : p
        ));
    };

    const closePanel = (key: string) => {
        setPanels(prev => prev.filter(p => p.key !== key));
    };

    return (
        <Flex>
            {/* Step 1: Input is visible only when there are no panels */}
            {!hasPanels && (
                <PromptBar
                    value={prompt}
                    onChange={setPrompt}
                    onSubmit={handlePromptSubmit}
                    loading={initialLoading}
                    error={initialError}
                />
            )}

            {/* Step 2+: Panels row. Appears when at least one panel exists. */}
            {hasPanels && (
                <PanelsRow
                    panels={panels}
                    onToggleView={togglePanelView}
                    onMinimize={toggleMinimizePanel}
                    onClose={closePanel}
                    onSelection={appendPanelForSelection}
                />
            )}
        </Flex>
    );
};

export default RussianDollsPage;


