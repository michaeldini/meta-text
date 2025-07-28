// Floating panel for chunk tool visibility (renamed from ChunkToolButtons)
// This component renders a floating panel with toggle buttons for chunk tools
// It allows users to select multiple tools at once and displays them in each chunk

import React from 'react';
import { Box, Text, ButtonGroup, IconButton } from '@chakra-ui/react';
import { Tooltip } from 'components';

import { useChunkStore } from 'store';
import { createChunkToolsRegistry, type ChunkToolId } from './toolsRegistry';

export function ChunkToolsPanel() {
    // This component renders a fixed bottom navigation bar with toggle buttons for chunk tools
    const activeTabs = useChunkStore(state => state.activeTabs);
    const setActiveTabs = useChunkStore(state => state.setActiveTabs);

    // Get tool definitions
    const toolsRegistry = createChunkToolsRegistry();

    // Toggle tool selection
    const handleToolClick = (toolId: ChunkToolId) => {
        if (activeTabs.includes(toolId)) {
            setActiveTabs(activeTabs.filter(id => id !== toolId));
        } else {
            setActiveTabs([...activeTabs, toolId]);
        }
    };

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
                {toolsRegistry.map((tool) => (
                    <Tooltip
                        key={tool.id}
                        content={<Text fontSize="sm">{tool.tooltip}</Text>}
                    >
                        <IconButton
                            aria-label={tool.name}
                            color={activeTabs.includes(tool.id) ? "primary" : "secondary"}
                            onClick={() => handleToolClick(tool.id)}
                            flex={1}
                            minWidth={0}
                            borderRadius={0}
                            variant="solid"
                            _hover={{
                                bg: "primary",
                            }}
                        >
                            {tool.icon}
                        </IconButton>
                    </Tooltip>
                ))}
            </ButtonGroup>
        </Box>
    );
};

export default ChunkToolsPanel;
