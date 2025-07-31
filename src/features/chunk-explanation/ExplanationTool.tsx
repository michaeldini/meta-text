import React, { useCallback } from 'react';
import { Box } from '@chakra-ui/react/box';
// import ReactMarkdown from 'react-markdown';

import { TooltipButton } from 'components/TooltipButton';
import { Prose } from 'components/typography';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { useExplainHandler } from './hooks/useExplainHandler';
import type { ChunkType, UpdateChunkFieldFn } from 'types';

interface ExplanationToolProps {
    chunk: ChunkType;
    updateChunkField: UpdateChunkFieldFn;
    isVisible: boolean;
}

export function ExplanationTool(props: ExplanationToolProps) {
    const { chunk, updateChunkField, isVisible } = props;
    if (!isVisible) return null;

    /**
     * Custom hook to handle chunk explanation logic
     * Returns a handler function and state for use in UI components
     */
    const { handleExplain, loading, error } = useExplainHandler({
        onComplete: (result) => {
            if (result && chunk?.id) {
                updateChunkField(chunk.id, 'explanation', result.explanation);
            }
        },
    });

    /**
     * Handler to generate explanation for the chunk
     * Calls the custom hook's handleExplain function with necessary parameters
     */
    const handleGenerate = useCallback(async () => {
        if (!chunk?.id) return;
        await handleExplain({
            words: "",
            context: chunk.text,
            metatext_id: null,
            chunk_id: chunk.id,
        });
    }, [chunk, handleExplain]);

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
                    <Prose>{chunk.explanation}</Prose>
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
