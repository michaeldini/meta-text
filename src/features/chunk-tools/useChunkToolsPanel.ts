// Custom hook for chunk tool panel logic
// Encapsulates state and handlers for chunk tool selection
// Used by ChunkToolsPanel to separate business logic from UI

import { useChunkToolsStore } from '@store/chunkToolsStore';
import { chunkToolsRegistry, type ChunkToolId } from './toolsRegistry';

export function useChunkToolsPanel() {
    // State from store
    const activeTabs = useChunkToolsStore(state => state.activeTabs);
    const setActiveTabs = useChunkToolsStore(state => state.setActiveTabs);


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
        chunkToolsRegistry,
        handleToolClick,
    };
}
