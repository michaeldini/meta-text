/**
 * Bottom panel for chunk tool visibility
 * Displays toggleable buttons for chunk tools
 * Allows users to select multiple tools at once
 */

import React from 'react';
import { styled, PanelContainer, ButtonGroup } from '@styles';
import TooltipButton from '@components/ui/TooltipButton';
import { useChunkToolsPanel } from './useChunkToolsPanel';


/**
 * ChunkToolsPanel
 * Renders a fixed bottom panel with toggleable chunk tool buttons.
 * Uses TooltipButton for consistent UI and accessibility.
 */
export function ChunkToolsPanel() {
    const { activeTabs, chunkToolsRegistry, handleToolClick } = useChunkToolsPanel();

    const toolButtons = chunkToolsRegistry.map((tool) => (
        <TooltipButton
            key={tool.id}
            label={tool.name}
            tooltip={tool.tooltip}
            icon={tool.icon}
            onClick={() => handleToolClick(tool.id)}
            disabled={false}
            tone={activeTabs.includes(tool.id) ? 'primary' : 'default'}
            style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-md)', justifyContent: 'center' }}
            role="button"
            aria-label={tool.name}
        />
    ));

    return (
        <PanelContainer>
            <ButtonGroup>
                {toolButtons}
            </ButtonGroup>
        </PanelContainer>
    );
}

export default ChunkToolsPanel;
