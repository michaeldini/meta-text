// Purpose: Render the row of panels with horizontal scrolling and spacing.

import React from 'react';
import { Box, Row } from '@styles';
import PanelCard from './PanelCard';
import { Panel } from '@mtypes/experiments';

export type PanelsRowProps = {
    panels: Panel[];
    onToggleView: (key: string) => void;
    onMinimize: (key: string, state?: boolean) => void;
    onClose: (key: string) => void;
    onSelection: (selection: string, context: string, range: { start: number; end: number }, sourcePanelKey: string) => void;
};

export function PanelsRow({ panels, onToggleView, onMinimize, onClose, onSelection }: PanelsRowProps) {
    return (
        <Box style={{ marginTop: 8, overflowX: 'auto' }}>
            <Row css={{ flexDirection: 'row', gap: '16px', alignItems: 'flex-start', minHeight: '200px', paddingBottom: 8 }}>
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
            </Row>
        </Box>
    );
};

export default PanelsRow;
