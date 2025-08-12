import { Icon } from '@components/icons/Icon';
// ExplanationTool
// Generates an explanation for a chunk's text via API and displays it.
// Mirrors the pattern used in EvaluationTool: keeps local state (loading, error, text)
// and syncs with incoming prop updates. Does not mutate parent chunk directly.

import React, { useState, useEffect, useCallback } from 'react';
import { Box } from '@chakra-ui/react/box';
import { ErrorAlert } from '@components/ErrorAlert';

import { TooltipButton } from '@components/TooltipButton';
import { Prose } from '@components/ui/prose';
import type { ChunkType } from '@mtypes/documents';
import { explainWordsOrChunk } from '@services/aiService';

interface ExplanationToolProps {
    chunk: ChunkType;
    isVisible: boolean;
}

export function ExplanationTool({ chunk, isVisible }: ExplanationToolProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [explanationText, setExplanationText] = useState<string>(chunk.explanation || '');

    // Sync local state if parent chunk updates (e.g., after refetch)
    useEffect(() => {
        setExplanationText(chunk.explanation || '');
    }, [chunk.id, chunk.explanation]);

    const handleGenerate = useCallback(async () => {
        if (!chunk.id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await explainWordsOrChunk({
                words: '',
                context: chunk.text,
                metatext_id: null,
                chunk_id: chunk.id,
            });
            // Prefer the primary explanation field; if context-specific explanation exists, append.
            const combined = data.explanation_in_context
                ? `${data.explanation}\n\n${data.explanation_in_context}`
                : data.explanation;
            setExplanationText(combined);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to generate explanation';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, [chunk.id, chunk.text]);

    if (!isVisible) return null;

    return (
        <Box>
            <TooltipButton
                label="Explain"
                tooltip="Generate a detailed explanation of this chunk's text."
                icon={<Icon name='AISparkle' />}
                onClick={handleGenerate}
                disabled={loading || !chunk.id}
                loading={loading}
            />
            <Box mt={3}>
                {explanationText ? <Prose>{explanationText}</Prose> : <span>No explanation yet.</span>}
            </Box>
            <ErrorAlert message={error} mt={2} />
        </Box>
    );
}

export default ExplanationTool;
