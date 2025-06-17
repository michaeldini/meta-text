import React from 'react';
import { Box } from '@mui/material';
import ToolIconButton from './ToolIconButton';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PhotoFilterIcon from '@mui/icons-material/PhotoFilter';

interface ChunkTabButtonsProps {
    activeTab: 'comparison' | 'ai-image';
    setActiveTab: (tab: 'comparison' | 'ai-image') => void;
}

const ChunkTabButtons: React.FC<ChunkTabButtonsProps> = ({ activeTab, setActiveTab }) => (
    <Box sx={{ display: 'flex', gap: 1, mb: 3, mt: 3, borderBottom: 1 }}>
        <ToolIconButton
            title="Show Comparison"
            icon={<CompareArrowsIcon />}
            color={activeTab === 'comparison' ? 'primary' : 'default'}
            ariaLabel="Show Comparison"
            onClick={() => setActiveTab('comparison')}
        />
        <ToolIconButton
            title="Show AI Image"
            icon={<PhotoFilterIcon />}
            color={activeTab === 'ai-image' ? 'primary' : 'default'}
            ariaLabel="Show AI Image"
            onClick={() => setActiveTab('ai-image')}
        />
    </Box>
);

export default ChunkTabButtons;
