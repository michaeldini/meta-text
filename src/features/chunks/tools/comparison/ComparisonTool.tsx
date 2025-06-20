import React, { useState } from 'react';
import { Box, Paper, IconButton, Tooltip } from '@mui/material';
import { CompareArrowsIcon } from '../../../../components/icons';
import AiGenerationButton from '../../../../components/AiGenerationButton';
import { useComparison } from './useComparison';
import { ComparisonToolProps } from '../types';
import { toolStyles } from '../../styles/styles';

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
                    <CompareArrowsIcon />
                </IconButton>
            </Tooltip>
        );
    }

    return (
        <Paper elevation={6} sx={toolStyles}>
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

export default ComparisonTool;
