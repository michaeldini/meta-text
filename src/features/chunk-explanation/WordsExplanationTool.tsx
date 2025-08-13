import { Icon } from '@components/icons/Icon';
/**
 * WordsExplanationTool.tsx
 * Tool for explaining a word in context. Uses custom hooks for API calls and state management.
 * Displays explanation and allows user to request definitions.
 */
import React, { useState, useCallback, useMemo } from 'react';
import { Text, Heading } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react/box';
import { ErrorAlert } from '@components/ErrorAlert';
import { TooltipButton } from '@components/TooltipButton';
import { useExplainHandler } from './hooks/useExplainHandler';
import { ChunkType } from '@mtypes/documents';

export interface ExplanationToolProps {
    /** The word or phrase to explain */
    word?: string;
    /** The chunk containing context for the explanation */
    chunk: ChunkType;
    /** Callback when explanation is updated */
    onExplanationUpdate?: (explanation: string) => void;
    /** Optional callback fired when explanation interaction completes */
    onComplete: () => void;
}



const trimPunctuation = (text: string): string => {
    // Remove leading and trailing punctuation/symbols and trim whitespace
    return text.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, '').trim();
};

export const WordsExplanationTool = React.memo((props: ExplanationToolProps) => {
    const { word, chunk, onComplete } = props;

    // Trim away whitespace and ensure word is not empty
    if (!word?.trim() || !chunk?.text) {
        return null;
    }
    // Custom hook to manage explanation logic
    const { handleExplain, result: explanation, loading, error } = useExplainHandler();


    const [showDefinition, setShowDefinition] = useState(false);
    const cleanedWord = useMemo(() => trimPunctuation(word), [word]);

    const handleDefine = useCallback(async () => {
        const result = await handleExplain({
            words: cleanedWord,
            context: chunk.text,
            metatext_id: chunk.metatext_id,
            chunk_id: null
        });
        // onComplete();
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
                    icon={<Icon name='Help' />}
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
                <Box    >
                    <Heading id="explanation-title" size="xl" mb={10} textAlign="left" textDecoration="underline">
                        {cleanedWord}
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
