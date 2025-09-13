/**
 * Bottom panel for chunk tool visibility
 * Displays toggleable buttons for chunk tools
 * Allows users to select multiple tools at once
 */

import React from 'react';
import { styled } from '@styles';
import TooltipButton from '@components/TooltipButton';
import { useChunkToolsPanel } from './useChunkToolsPanel';

const PanelContainer = styled('div', {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    // zIndex: 99999, // Increased z-index for highest stacking
    width: '100vw',
    background: 'black',
    boxShadow: '0 -2px 8px rgba(0,0,0,0.04)',
    minHeight: '48px',
    color: 'white',
});

const ButtonGroup = styled('div', {
    display: 'flex',
    justifyContent: 'stretch',
    alignItems: 'center',
    gap: 0,
    width: '100%',
    padding: '$2',
});




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
