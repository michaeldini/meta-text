import React, { useCallback } from 'react';
import { Box } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown';

import { AiGenerationButton } from 'components';
import type { ChunkType, UpdateChunkFieldFn } from 'types';
import { useEvaluation } from './hooks/useEvaluation';

interface EvaluationToolProps {
    chunk: ChunkType;
    updateChunkField: UpdateChunkFieldFn;
    isVisible: boolean;
}

export function EvaluationTool(props: EvaluationToolProps) {
    const { chunk, updateChunkField, isVisible } = props;
    if (!isVisible) return null;

    const { fetchEvaluationResults, loading, error } = useEvaluation();

    const handleGenerate = useCallback(async () => {
        const result = await fetchEvaluationResults({
            chunk
        });

        if (result.success && result.data) {
            updateChunkField(chunk.id, 'evaluation', result.data.evaluationText);
        }
    }, [chunk, fetchEvaluationResults, updateChunkField]);

    return (
        <Box >
            <AiGenerationButton
                label="Evaluate"
                toolTip="Produce an evaluation of your summary and note."
                loading={loading}
                onClick={handleGenerate}
                disabled={loading || !chunk?.id}
            />
            <Box>
                {chunk.evaluation ? (
                    <ReactMarkdown>{chunk.evaluation}</ReactMarkdown>
                ) : (
                    <span>No evaluation yet.</span>
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

export default EvaluationTool;
