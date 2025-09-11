// Purpose: Render the row of panels with horizontal scrolling and spacing.

import React from 'react';
import { Box, Wrap } from '@styles';
import PanelCard from '../features/russion-dolls/components/PanelCard';
import { Panel } from '../types/experiments';

export type PanelsRowProps = {
    panels: Panel[];
    onToggleView: (key: string) => void;
    onMinimize: (key: string, state?: boolean) => void;
    onClose: (key: string) => void;
    onSelection: (selection: string, context: string, range: { start: number; end: number }, sourcePanelKey: string) => void;
};

export function PanelsRow({ panels, onToggleView, onMinimize, onClose, onSelection }: PanelsRowProps) {
    return (
        <Box css={{ marginTop: 8, overflowX: 'auto' }}>
            <Wrap css={{ flexDirection: 'row', gap: 16, alignItems: 'flex-start', minHeight: 200, paddingBottom: 8 }}>
                {panels.map(panel => (
                    <PanelCard
                        key={panel.key}
                        panel={panel}
                        onToggleView={onToggleView}
                        onMinimize={onMinimize}
                        onClose={onClose}
                        onSelection={onSelection}
                    />)
                )}
            </Wrap>
        </Box>
    );
};

export default PanelsRow;
