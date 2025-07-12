import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '@mui/material/styles';

import { AiGenerationButton } from 'components';
import { useExplanation } from './hooks/useExplanation';
import type { ChunkType, UpdateChunkFieldFn } from 'types';
import { getSharedToolStyles } from 'features/chunk-shared/styles';

interface ExplanationToolProps {
    chunk: ChunkType;
    updateChunkField: UpdateChunkFieldFn;
    isVisible: boolean;
}

const ExplanationTool: React.FC<ExplanationToolProps> = ({
    chunk,
    updateChunkField,
    isVisible
}) => {
    if (!isVisible) return null;

    const { explain, loading, error } = useExplanation();
    const theme = useTheme();
    const styles = getSharedToolStyles(theme);

    const handleGenerate = useCallback(async () => {
        if (!chunk?.id) return;
        const result = await explain({ chunkId: chunk.id, context: chunk.text, words: "" });
        if (result) {
            updateChunkField(chunk.id, 'explanation', result.explanation);
        }
    }, [chunk, explain, updateChunkField]);

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
            <Box sx={styles.scrollableContentContainerWide}>
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

export default ExplanationTool;
