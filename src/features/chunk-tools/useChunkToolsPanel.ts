// Custom hook for chunk tool panel logic
// Encapsulates state and handlers for chunk tool selection
// Used by ChunkToolsPanel to separate business logic from UI

import { useChunkStore } from 'store';
import { createChunkToolsRegistry, type ChunkToolId } from './toolsRegistry';

export function useChunkToolsPanel() {
    // State from store
    const activeTabs = useChunkStore(state => state.activeTabs);
    const setActiveTabs = useChunkStore(state => state.setActiveTabs);

    // Tool definitions
    const toolsRegistry = createChunkToolsRegistry();

    // Toggle tool selection
    const handleToolClick = (toolId: ChunkToolId) => {
        if (activeTabs.includes(toolId)) {
            setActiveTabs(activeTabs.filter(id => id !== toolId));
        } else {
            setActiveTabs([...activeTabs, toolId]);
        }
    };

    return {
        activeTabs,
        setActiveTabs,
        toolsRegistry,
        handleToolClick,
    };
}
