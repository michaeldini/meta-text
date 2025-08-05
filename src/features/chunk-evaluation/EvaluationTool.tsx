import React, { useCallback } from 'react';
import { Box } from '@chakra-ui/react/box'
import { Prose } from '@components/ui/prose';
import { TooltipButton } from '@components/TooltipButton'
import { HiOutlineSparkles } from 'react-icons/hi2';
import type { ChunkType, UpdateChunkFieldMutationFn } from '@mtypes/documents';
import { useEvaluation } from './hooks/useEvaluation';

interface EvaluationToolProps {
    chunk: ChunkType;
    mutateChunkField: UpdateChunkFieldMutationFn;
    isVisible: boolean;
}
export function EvaluationTool(props: EvaluationToolProps) {
    const { chunk, mutateChunkField, isVisible } = props;
    if (!isVisible) return null;

    const { fetchEvaluationResults, loading, error } = useEvaluation();

    const handleGenerate = useCallback(async () => {
        const result = await fetchEvaluationResults({ chunk });
        if (result.success && result.data) {
            mutateChunkField({ chunkId: chunk.id, field: 'evaluation', value: result.data.evaluationText });
        }
    }, [chunk, fetchEvaluationResults, mutateChunkField]);

    return (
        <Box>
            <TooltipButton
                label="Evaluate"
                tooltip="Produce an evaluation of your summary and note."
                icon={<HiOutlineSparkles />}
                onClick={handleGenerate}
                // disabled={loading || !chunk?.id}
                loading={loading}
            />
            <Box>
                {chunk.evaluation ? (
                    <Prose>{chunk.evaluation}</Prose>
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
