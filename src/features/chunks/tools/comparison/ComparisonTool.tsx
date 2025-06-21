import React, { useState } from 'react';
import { Box, Paper, IconButton, Tooltip } from '@mui/material';
import { CompareArrowsIcon } from '../../../../components/icons';
import AiGenerationButton from '../../../../components/AiGenerationButton';
import { useComparison } from './useComparison';
import { ComparisonToolProps } from '../types';
import { generateChunkNoteSummaryTextComparison } from '../../../../services/aiService';
import { createToolStyles } from './styles/ComparisonToolStyles';
import { useTheme } from '@mui/material/styles';

interface ComparisonToolComponentProps extends ComparisonToolProps {
    /** Current comparison text */
    comparisonText?: string;
    /** Callback when comparison is updated */
    onComparisonUpdate?: (text: string) => void;
    /** Callback when action completes */
    onComplete?: (success: boolean, result?: any) => void;
    /** Render as compact button only */
    compact?: boolean;
}

/**
 * Comparison Tool Component
 * Generates AI-powered comparisons for chunks
 */
const ComparisonTool: React.FC<ComparisonToolComponentProps> = ({
    chunkIdx,
    chunk,
    comparisonText = '',
    onComparisonUpdate,
    onComplete,
    compact = false
}) => {
    const theme = useTheme();
    const toolStyles = createToolStyles(theme);
    const { generateComparison, loading, error } = useComparison();

    const handleGenerate = async () => {
        const result = await generateComparison({
            chunkIdx,
            chunk
        });

        if (result.success && result.data) {
            onComparisonUpdate?.(result.data.comparisonText);
        }

        onComplete?.(result.success, result.data);
    };

    if (compact) {
        return (
            <Tooltip title="Generate comparison summary">
                <IconButton
                    onClick={handleGenerate}
                    disabled={loading || !chunk?.id}
                    size="small"
                    aria-label="Generate comparison"
                >
                    <CompareArrowsIcon style={{ width: 24, height: 24, color: 'currentColor' }} />
                </IconButton>
            </Tooltip>
        );
    }

    return (
        <Paper elevation={6}>
            <AiGenerationButton
                label="What Did I Miss?"
                toolTip="Generate a summary of what you might have missed in this chunk based on your notes and summary."
                loading={loading}
                onClick={handleGenerate}
                sx={{ ml: 1 }}
                disabled={loading || !chunk?.id}
            />
            <Box>
                {comparisonText || <span style={{ color: '#aaa' }}>No comparison yet.</span>}
            </Box>
            {error && <Box sx={{ color: 'error.main', fontSize: 12 }}>{error}</Box>}
        </Paper>
    );
};

interface ChunkComparisonProps {
    chunkId: number;
    comparisonText: string;
    onComparisonUpdate: (text: string) => void;
}

const ChunkComparison: React.FC<ChunkComparisonProps> = ({ chunkId, comparisonText, onComparisonUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await generateChunkNoteSummaryTextComparison(chunkId);
            onComparisonUpdate(data.result || '');
        } catch {
            setError('Error generating summary');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={6}>
            <AiGenerationButton
                label="What Did I Miss?"
                toolTip="Generate a summary of what you might have missed in this chunk based on your notes and summary."
                loading={loading}
                onClick={handleGenerate}
                sx={{ ml: 1 }}
                disabled={loading || !chunkId}
            />
            <Box>
                {comparisonText || <span style={{ color: '#aaa' }}>No summary yet.</span>}
            </Box>
            {error && <Box sx={{ color: 'error.main', fontSize: 12 }}>{error}</Box>}
        </Paper>
    );
};

export { ChunkComparison };
export default ComparisonTool;
