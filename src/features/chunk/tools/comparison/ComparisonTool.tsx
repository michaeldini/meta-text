import React, { useState } from 'react';
import { Box, Paper, IconButton, Tooltip } from '@mui/material';
import { CompareArrowsIcon } from '../../../../components/icons';
import AiGenerationButton from '../../../../components/AiGenerationButton';
import { useComparison } from './useComparison';
import { ComparisonToolProps } from '../types';
import { generateChunkNoteSummaryTextComparison } from '../../../../services/aiService';
import { getToolsStyles } from '../styles/Tools.styles';
import { useTheme } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';

interface ComparisonToolComponentProps extends ComparisonToolProps {
    /** Current comparison text */
    comparisonText?: string;
    /** Callback when comparison is updated */
    onComparisonUpdate?: (text: string) => void;
    /** Callback when action completes */
    onComplete?: (success: boolean, result?: any) => void;
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
    onComplete
}) => {
    const { generateComparison, loading, error } = useComparison();
    const theme = useTheme();
    const styles = getToolsStyles(theme);

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

    return (
        <Box sx={styles.toolTabContainer}>
            <AiGenerationButton
                label="What Did I Miss?"
                toolTip="Generate a summary of what you might have missed in this chunk based on your notes and summary."
                loading={loading}
                onClick={handleGenerate}
                sx={{ ml: 1 }}
                disabled={loading || !chunk?.id}
            />
            <Box>
                {comparisonText ? (
                    <ReactMarkdown>{comparisonText}</ReactMarkdown>
                ) : (
                    <span style={{ color: '#aaa' }}>No comparison yet.</span>
                )}
            </Box>
            {error && <Box sx={{ color: 'error.main', fontSize: 12 }}>{error}</Box>}
        </Box>
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
    const theme = useTheme();
    const styles = getToolsStyles(theme);

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
        <Box sx={styles.toolTabContainer}>
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
        </Box>
    );
};

export { ChunkComparison };
export default ComparisonTool;
