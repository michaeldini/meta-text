// Purpose: Two-step exploration UI composed from smaller components.
// - PromptBar: shown when there are no panels yet, submits the initial prompt.
// - PanelsRow: renders PanelCard components side by side.
// - PanelCard: shows explanation text via WordSelector; selecting text spawns a new panel.
// - textContext utils: builds a tight context slice when the user makes a selection.


import React, { useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';

// Switch to the mock during development to avoid real API calls.
// For production, change this import back to: '../services/aiService'
import { explain2, ExplanationResponse2 } from '../services/aiService.mock';
// import { explain2, ExplanationResponse2 } from '../services/aiService';
import { buildContextSlice } from '../utils/textContext';
import { Panel } from '../types/experiments';
import PromptBar from '../components/PromptBar';
import PanelsRow from '../components/PanelsRow';

const ExperimentsPage2: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [panels, setPanels] = useState<Panel[]>([]);
    const [initialLoading, setInitialLoading] = useState(false);
    const [initialError, setInitialError] = useState<string | null>(null);
    const hasPanels = panels.length > 0;


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
                viewMode: 'comprehensive',
                minimized: false,
            };
            setPanels([panel]);
            setPrompt('');
        } catch (err: any) {
            setInitialError(err?.message ?? 'Failed to fetch explanation');
        } finally {
            setInitialLoading(false);
        }
    };

    // Step 2: Mouse selection (multi-word) -> append a new panel
    const appendPanelForSelection = async (selection: string, fullTextContext: string) => {
        const contextSlice = buildContextSlice(selection, fullTextContext);

        const key = `panel-${Date.now()}-${panels.length}`;
        // optimistic placeholder panel
        setPanels(prev => [
            ...prev,
            { key, sourceWord: selection, loading: true, error: null, viewMode: 'comprehensive', minimized: false },
        ]);

        try {
            const res = await explain2({ word: selection, context: contextSlice });
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
        <Flex direction="column" h="100%" p={4}>
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

export default ExperimentsPage2;


