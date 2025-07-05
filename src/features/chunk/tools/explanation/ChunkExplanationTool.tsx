import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '@mui/material/styles';

import { AiGenerationButton } from 'components';
import { useExplanation } from './useExplanation';
import type { ChunkType } from 'types';
import { getExplanationStyles } from './ChunkExplanation.styles';

interface ExplanationToolProps {
    chunk: ChunkType;
    onExplanationUpdate?: (text: string) => void;
}

const ChunkExplanationTool: React.FC<ExplanationToolProps> = ({
    chunk,
    onExplanationUpdate
}) => {
    const { explain, loading, error } = useExplanation();
    const theme = useTheme();
    const styles = getExplanationStyles(theme);

    const handleGenerate = useCallback(async () => {
        if (!chunk?.id) return;
        const result = await explain({ chunkId: chunk.id, context: chunk.text, words: "" });
        if (result) {
            onExplanationUpdate?.(result.explanation);
        }
    }, [chunk, explain, onExplanationUpdate]);

    return (
        <Box sx={styles.toolTabContainer}>
            <AiGenerationButton
                label="Explain This Chunk"
                toolTip="Generate a detailed, in-depth explanation of this chunk's text."
                loading={loading}
                onClick={handleGenerate}
                sx={{ ml: 1 }}
                disabled={loading || !chunk?.id}
            />
            <Box sx={styles.explanationTextContainer}>
                {chunk.explanation ? (
                    <ReactMarkdown>{chunk.explanation}</ReactMarkdown>
                ) : (
                    <span >No explanation yet.</span>
                )}
            </Box>
            {error && <Box sx={{ color: 'error.main', fontSize: 12 }}>{error}</Box>}
        </Box>
    );
};

export default ChunkExplanationTool;
