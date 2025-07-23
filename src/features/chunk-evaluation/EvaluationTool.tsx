import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';

import { AiGenerationButton } from 'components';
import type { ChunkType, UpdateChunkFieldFn } from 'types';
import { useEvaluation } from './hooks/useEvaluation';
import { getSharedToolStyles } from 'features/chunk-shared/styles';

interface EvaluationToolProps {
    chunk: ChunkType;
    updateChunkField: UpdateChunkFieldFn;
    isVisible: boolean;
}

const EvaluationTool: React.FC<EvaluationToolProps> = ({
    chunk,
    updateChunkField,
    isVisible,
}) => {
    if (!isVisible) return null;

    const { fetchEvaluationResults, loading, error } = useEvaluation();
    const theme = useTheme();
    const styles = getSharedToolStyles(theme);

    const handleGenerate = useCallback(async () => {
        const result = await fetchEvaluationResults({
            chunk
        });

        if (result.success && result.data) {
            updateChunkField(chunk.id, 'evaluation', result.data.evaluationText);
        }
    }, [chunk, fetchEvaluationResults, updateChunkField]);

    return (
        <Box sx={styles.toolTabContainer}>
            <AiGenerationButton
                label="Evaluate"
                toolTip="Produce an evaluation of your summary and note."
                loading={loading}
                onClick={handleGenerate}
                sx={{ ml: 1 }}
                disabled={loading || !chunk?.id}
            />
            <Box sx={styles.scrollableContentContainer}>
                {chunk.evaluation ? (
                    <ReactMarkdown>{chunk.evaluation}</ReactMarkdown>
                ) : (
                    <span>No evaluation yet.</span>
                )}
            </Box>
            {error && <Box sx={{ color: 'error.main', fontSize: 12 }}>{error}</Box>}
        </Box>
    );
};

export default EvaluationTool;
