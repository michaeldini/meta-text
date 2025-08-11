/**
 * Bottom panel for chunk tool visibility
 * Displays toggleable buttons for chunk tools
 * Allows users to select multiple tools at once
 */
import React from 'react';
import { ButtonGroup, IconButton } from '@chakra-ui/react/button';
import { Box } from '@chakra-ui/react/box';
import { Text } from '@chakra-ui/react';

import { Tooltip } from '@components/ui/tooltip';

import { useChunkToolsPanel } from './useChunkToolsPanel';

export function ChunkToolsPanel() {
    // Use custom hook for business logic
    const {
        activeTabs,
        setActiveTabs, // in case needed for future
        chunkToolsRegistry,
        handleToolClick,
    } = useChunkToolsPanel();

    //  Map tools to buttons
    // Each button toggles the corresponding tool
    // Active tools are highlighted
    const toolButtons = chunkToolsRegistry.map((tool) => (
        <Tooltip
            key={tool.id}
            content={<Text fontSize="sm">{tool.tooltip}</Text>}
        >
            <IconButton
                aria-label={tool.name}
                onClick={() => handleToolClick(tool.id)}
                flex={1}
                bg="bg.subtle"
                color={activeTabs.includes(tool.id) ? "primary" : "bg.emphasized"}
                _hover={{ bg: "bg.muted", color: "primary" }}
            >
                {tool.icon}
            </IconButton>
        </Tooltip>
    ));


    // Render the bottom panel with tool buttons
    // Uses Chakra UI Box for fixed positioning
    // ButtonGroup for layout and styling
    // Each button is wrapped in a Tooltip for accessibility
    // Flex properties ensure buttons stretch evenly
    return (
        <Box position='fixed' left={0} right={0} bottom={0} zIndex={9999}
        >
            <ButtonGroup
                size="lg"
                width="100vw"
                display="flex"
                justifyContent="stretch"
                alignItems="center"
                gap={0}
            >
                {toolButtons}
            </ButtonGroup>
        </Box>
    );
}

export default ChunkToolsPanel;
