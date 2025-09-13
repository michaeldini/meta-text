import { HiOutlineSparkles } from 'react-icons/hi2';
/**
 * EvaluationTool
 * Generates an evaluation for a chunk via API and displays it.
 * Avoids mutating incoming props; uses local state and syncs if parent updates chunk.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text } from '@styles';
import { ErrorAlert } from '@components/ErrorAlert';
import { TooltipButton } from '@components/ui/TooltipButton'
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
                icon={<HiOutlineSparkles />}
                onClick={handleGenerate}
                disabled={loading || !chunk.id}
                loading={loading}
            />
            <Box >
                {evaluationText
                    ? <Text>{evaluationText}</Text>
                    : <Text css={{ textAlign: 'right', color: '$colors$subtle' }}>No evaluation yet.</Text>}
            </Box>
            <ErrorAlert message={error} mt={2} />
        </Box>
    );
}

export default EvaluationTool;