import { HiQuestionMarkCircle } from 'react-icons/hi2';
/**
 * WordsExplanationTool.tsx
 * Tool for explaining a word in context. Uses custom hooks for API calls and state management.
 * Displays explanation and allows user to request definitions.
 */
import React, { useState, useCallback } from 'react';
import { Text, Heading } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react/box';
import { ErrorAlert } from '@components/ErrorAlert';
import { TooltipButton } from '@components/TooltipButton';
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
                <>
                    <TooltipButton
                        label={`Explain`}
                        tooltip={`Get an explanation for "${word}"`}
                        icon={<HiQuestionMarkCircle />}
                        size="2xl"
                        onClick={handleDefine}
                        disabled={loading}
                        loading={loading}
                        aria-label={`Define ${word}`}
                        data-testid={`explain-word-${word}`}
                        positioning={{ placement: "top" }}
                    />
                </>
            )}
            {/* Show explanation only if showDefinition is true */}
            {showDefinition && (
                <Box>
                    <Heading id="explanation-title" size="xl" mb={10} textAlign="left" textDecoration="underline">
                        {word}
                    </Heading>
                    {explanation?.explanation && (
                        <Text textStyle="lg" mb="2">{explanation.explanation}</Text>
                    )}
                    {explanation?.explanation_in_context && (
                        <Text textStyle="lg">{explanation.explanation_in_context}</Text>
                    )}
                    <ErrorAlert message={error} mt={2} />
                </Box>
            )}
        </>
    );
});

WordsExplanationTool.displayName = 'WordsExplanationTool';

export default WordsExplanationTool;
