import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';

import { AiGenerationButton } from 'components';
import { generateChunkNoteSummaryTextComparison } from 'services';

import { ComparisonToolProps } from '../types';
import { useComparison } from './useComparison';
import { getToolsStyles } from './Comparison.styles';

interface ComparisonToolComponentProps extends ComparisonToolProps {
    onComparisonUpdate: (text: string) => void;
}

const ComparisonTool: React.FC<ComparisonToolComponentProps> = ({
    chunk,
    onComparisonUpdate,
}) => {
    const { generateComparison, loading, error } = useComparison();
    const theme = useTheme();
    const styles = getToolsStyles(theme);

    const handleGenerate = async () => {
        const result = await generateComparison({
            chunk
        });

        if (result.success && result.data) {
            onComparisonUpdate(result.data.comparisonText);
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
                disabled={loading || !chunk?.id}
            />
            <Box sx={styles.comparisonTextContainer}>
                {chunk.comparison ? (
                    <ReactMarkdown>{chunk.comparison}</ReactMarkdown>
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
export default ComparisonTool;
