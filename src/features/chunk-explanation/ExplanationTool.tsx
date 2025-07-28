import React, { useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

import { TooltipButton } from 'components';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { useExplanation } from './hooks/useExplanation';
import type { ChunkType, UpdateChunkFieldFn } from 'types';

interface ExplanationToolProps {
    chunk: ChunkType;
    updateChunkField: UpdateChunkFieldFn;
    isVisible: boolean;
}

export function ExplanationTool(props: ExplanationToolProps) {
    const { chunk, updateChunkField, isVisible } = props;
    if (!isVisible) return null;

    const { explain, loading, error } = useExplanation();

    const handleGenerate = useCallback(async () => {
        if (!chunk?.id) return;
        const result = await explain({ chunk_id: chunk.id, context: chunk.text, words: "" });
        if (result) {
            updateChunkField(chunk.id, 'explanation', result.explanation);
        }
    }, [chunk, explain, updateChunkField]);

    return (
        <Box>
            <TooltipButton
                label="Explain This Chunk"
                tooltip="Generate a detailed, in-depth explanation of this chunk's text."
                icon={<HiOutlineSparkles />}
                onClick={handleGenerate}
                disabled={loading || !chunk?.id}
            />
            <Box>
                {chunk.explanation ? (
                    <ReactMarkdown>{chunk.explanation}</ReactMarkdown>
                ) : (
                    <span>No explanation yet.</span>
                )}
            </Box>
            {error && (
                <Box color="red.500" mt={2}>
                    <strong>Error:</strong> {error}
                </Box>
            )}
        </Box>
    );
};

export default ExplanationTool;
