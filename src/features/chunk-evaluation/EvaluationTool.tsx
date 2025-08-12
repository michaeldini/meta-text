import { Icon } from '@components/icons/Icon';
/**
 * EvaluationTool
 * Generates an evaluation/explanation for a chunk via API and displays it.
 * Avoids mutating incoming props; uses local state and syncs if parent updates chunk.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@chakra-ui/react/box'
import { ErrorAlert } from '@components/ErrorAlert';
import { Prose } from '@components/ui/prose';
import { TooltipButton } from '@components/TooltipButton'
import type { ChunkType } from '@mtypes/documents';
import { generateEvaluation } from '@services/aiService';

interface EvaluationToolProps {
    chunk: ChunkType;
    isVisible: boolean;
}

export function EvaluationTool({ chunk, isVisible }: EvaluationToolProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [evaluationText, setEvaluationText] = useState<string>(chunk.evaluation || '');

    // Keep local state in sync if parent provides updated evaluation (e.g. after a refetch)
    useEffect(() => {
        setEvaluationText(chunk.evaluation || '');
    }, [chunk.id, chunk.evaluation]);

    const handleGenerate = useCallback(async () => {
        if (!chunk.id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await generateEvaluation(chunk.id);
            const text = data.evaluation_text || '';
            setEvaluationText(text);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Error generating evaluation';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [chunk.id]);

    if (!isVisible) return null;

    return (
        <Box>
            <TooltipButton
                label="Evaluate"
                tooltip="Produce an evaluation of your summary and note."
                icon={<Icon name='AISparkle' />}
                onClick={handleGenerate}
                disabled={loading || !chunk.id}
                loading={loading}
            />
            <Box mt={3}>
                {evaluationText
                    ? <Prose>{evaluationText}</Prose>
                    : <span>No evaluation yet.</span>}
            </Box>
            <ErrorAlert message={error} mt={2} />
        </Box>
    );
}

export default EvaluationTool;