import { useChunkStore } from '../../../../store/chunkStore';

export function useChunkTabState() {
    const activeTabs = useChunkStore(state => state.activeTabs);
    return activeTabs;
}
