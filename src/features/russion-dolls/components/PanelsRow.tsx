// Purpose: Render the row of panels with horizontal scrolling and spacing.

import React from 'react';
import { Box, Wrap } from '@chakra-ui/react';
import PanelCard from './PanelCard';
import { Panel } from '../../../types/experiments';

export type PanelsRowProps = {
    panels: Panel[];
    onToggleView: (key: string) => void;
    onMinimize: (key: string, state?: boolean) => void;
    onClose: (key: string) => void;
    onSelection: (selection: string, context: string, range: { start: number; end: number }, sourcePanelKey: string) => void;
};

export function PanelsRow({ panels, onToggleView, onMinimize, onClose, onSelection }: PanelsRowProps) {
    return (
        <Box mt={2} overflowX="auto">
            <Wrap direction="row" gap={4} align="flex-start" minH="200px" pb={2}>
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
