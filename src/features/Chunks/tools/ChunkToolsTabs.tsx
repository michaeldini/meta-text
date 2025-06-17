import React from 'react';
import ChunkTabButtons from './ChunkTabButtons';
import ChunkComparisonPanel from '../comparison/ChunkComparisonPanel';
import ChunkImagePanel from '../image/ChunkImagePanel';

interface ChunkToolsTabsProps {
    chunk: any;
    activeTab: 'comparison' | 'ai-image';
    setActiveTab: (tab: 'comparison' | 'ai-image') => void;
    imageState: any;
    openDialog: () => void;
    getImgSrc: () => string;
    setImageLoaded: (loaded: boolean) => void;
    setLightboxOpen: (open: boolean) => void;
    handleComparisonUpdate: (newComparison: string) => void;
}

const ChunkToolsTabs: React.FC<ChunkToolsTabsProps> = ({
    chunk,
    activeTab,
    setActiveTab,
    imageState,
    openDialog,
    getImgSrc,
    setImageLoaded,
    setLightboxOpen,
    handleComparisonUpdate,
}) => (
    <>
        <ChunkTabButtons activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'comparison' && (
            <ChunkComparisonPanel
                chunkId={chunk.id}
                comparisonText={chunk.comparison}
                onComparisonUpdate={handleComparisonUpdate}
            />
        )}
        {activeTab === 'ai-image' && (
            <ChunkImagePanel
                imageState={imageState}
                openDialog={openDialog}
                getImgSrc={getImgSrc}
                setImageLoaded={setImageLoaded}
                setLightboxOpen={setLightboxOpen}
                imgPrompt={imageState.prompt}
                createdAt={chunk.ai_image && chunk.ai_image.created_at}
            />
        )}
    </>
);

export default ChunkToolsTabs;
