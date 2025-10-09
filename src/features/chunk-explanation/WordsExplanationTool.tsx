import { HiQuestionMarkCircle } from 'react-icons/hi2';
/**
 * WordsExplanationTool.tsx
 * Tool for explaining a word in context. Uses custom hooks for API calls and state management.
 * Displays explanation and allows user to request definitions.
 */
import React, { useState, useCallback } from 'react';
import { Text, Heading, Box } from '@styles';
import { Alert } from '@components/Alert';
import { Button } from '@components';
import { useExplainHandler } from './hooks/useExplainHandler';
import { ChunkType } from '@mtypes/documents';

export interface ExplanationToolProps {
    word: string;
    chunk: ChunkType;
}

export const WordsExplanationTool = React.memo((props: ExplanationToolProps) => {
    const { word, chunk } = props;

    // Custom hook to manage explanation logic
    const { handleExplain, result: explanation, loading, error } = useExplainHandler();
    const [showDefinition, setShowDefinition] = useState(false);
    const handleDefine = useCallback(async () => {
        const result = await handleExplain({
            words: word,
            context: chunk.text,
            metatext_id: chunk.metatext_id,
            chunk_id: null
        });
        // onComplete();
        if (result) {
            setShowDefinition(true);
        }
    }, [chunk.text, chunk.metatext_id, handleExplain, word]);
    return (
        <>
            {/* Show button only if not showing definition */}
            {!showDefinition && (
                <Button
                    icon={<HiQuestionMarkCircle />}
                    onClick={handleDefine}
                    disabled={loading}
                    aria-label={`Define ${word}`}
                    data-testid={`explain-word-${word}`}
                />
            )}
            {/* Show explanation only if showDefinition is true */}
            {showDefinition && (
                <Box>
                    <Heading css={{ fontSize: '1.25rem', marginBottom: 10, textAlign: 'left', textDecoration: 'underline' }} id="explanation-title">
                        {word}
                    </Heading>
                    {explanation?.explanation && (
                        <Text css={{ fontSize: '1rem', marginBottom: 8 }}>{explanation.explanation}</Text>
                    )}
                    {explanation?.explanation_in_context && (
                        <Text css={{ fontSize: '1rem' }}>{explanation.explanation_in_context}</Text>
                    )}
                    <Alert type="error" message={error} />
                </Box>
            )}
        </>
    );
});

WordsExplanationTool.displayName = 'WordsExplanationTool';

export default WordsExplanationTool;
