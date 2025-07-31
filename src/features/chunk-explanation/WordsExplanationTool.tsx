/**
 * WordsExplanationTool.tsx
 * Tool for explaining a word in context. Uses custom hooks for API calls and state management.
 * Displays explanation and allows user to request definitions.
 */
import React, { useState, useCallback, useMemo } from 'react';
import { Text, Heading } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react/box';
import { TooltipButton, AppAlert } from 'components';
import type { ExplanationToolProps } from 'features';
import { HiQuestionMarkCircle } from 'react-icons/hi2';
import { useExplainHandler } from './hooks/useExplainHandler';



const removeTrailingPunctuation = (text: string): string => {
    return text.replace(/[\p{P}\p{S}]+$/gu, '').trim();
};

export const WordsExplanationTool = React.memo((props: ExplanationToolProps) => {
    const { word, chunk, onComplete } = props;

    // Trim away whitespace and ensure word is not empty
    if (!word?.trim() || !chunk?.text) {
        return null;
    }
    // Custom hook to manage explanation logic
    const { handleExplain, result: explanation, loading, error } = useExplainHandler({
    });


    const [showDefinition, setShowDefinition] = useState(false);
    const cleanedWord = useMemo(() => removeTrailingPunctuation(word), [word]);

    const handleDefine = useCallback(async () => {
        const result = await handleExplain({
            words: cleanedWord,
            context: chunk.text,
            metatext_id: chunk.metatext_id,
            chunk_id: null
        });
        if (result) {
            setShowDefinition(true);
        }
    }, [cleanedWord, chunk.text, chunk.metatext_id, handleExplain]);



    return (
        <>
            {/* Show button only if not showing definition */}
            {!showDefinition && (
                <TooltipButton
                    label={`Define "${cleanedWord}"`}
                    tooltip={`Click to get an explanation for "${cleanedWord}"`}
                    icon={<HiQuestionMarkCircle />}
                    iconSize="2xl"
                    size="2xl"
                    onClick={handleDefine}
                    disabled={loading}
                    loading={loading}
                    aria-label={`Define ${cleanedWord}`}
                    data-testid={`explain-word-${cleanedWord}`}
                />
            )}

            {/* Show explanation only if showDefinition is true */}
            {showDefinition && (
                <Box mt={4} p={4}>
                    <Heading id="explanation-title" size="md" mb={2}>
                        Explaining: {cleanedWord}
                    </Heading>
                    {loading && (
                        <Text>Loading...</Text>
                    )}
                    {error && (
                        <AppAlert severity="error">{error}</AppAlert>
                    )}
                    {explanation?.explanation && (
                        <Box mt={2}>
                            <Heading size="sm">General Explanation:</Heading>
                            <Text>{explanation.explanation}</Text>
                        </Box>
                    )}
                    {explanation?.explanation_in_context && (
                        <Box mt={2}>
                            <Heading size="sm">Explanation in Context:</Heading>
                            <Text>{explanation.explanation_in_context}</Text>
                        </Box>
                    )}
                </Box>
            )}
        </>
    );
});

WordsExplanationTool.displayName = 'WordsExplanationTool';

export default WordsExplanationTool;
