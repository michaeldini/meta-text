import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';

import { AiGenerationButton } from 'components';

import { ComparisonToolProps } from '../types';
import { useComparison } from './useComparison';
import { getSharedToolStyles } from '../shared.styles';

const ComparisonTool: React.FC<ComparisonToolProps> = ({
    chunk,
    onComparisonUpdate,
}) => {
    const { generateComparison, loading, error } = useComparison();
    const theme = useTheme();
    const styles = getSharedToolStyles(theme);

    const handleGenerate = async () => {
        const result = await generateComparison({
            chunk
        });

        if (result.success && result.data) {
            onComparisonUpdate?.(result.data.comparisonText);
        }
    };

    return (
        <Box sx={styles.toolTabContainer}>
            <AiGenerationButton
                label="What Did I Miss?"
                toolTip="Generate a summary of what you might have missed based on your notes and summary."
                loading={loading}
                onClick={handleGenerate}
                sx={{ ml: 1 }}
                disabled={loading || !chunk?.id}
            />
            <Box sx={styles.scrollableContentContainerWide}>
                {chunk.comparison ? (
                    <ReactMarkdown>{chunk.comparison}</ReactMarkdown>
                ) : (
                    <span>No comparison yet.</span>
                )}
            </Box>
            {error && <Box sx={{ color: 'error.main', fontSize: 12 }}>{error}</Box>}
        </Box>
    );
};

export default ComparisonTool;
