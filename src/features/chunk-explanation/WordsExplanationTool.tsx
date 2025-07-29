
import React, { useState, useCallback, useMemo } from 'react';

import { Text, Heading } from '@chakra-ui/react/typography';
import { Drawer } from '@chakra-ui/react/drawer';
import { Box } from '@chakra-ui/react/box';
// import { IconButton } from '@chakra-ui/react/button';
import { TooltipButton, AppAlert } from 'components';

import { HiQuestionMarkCircle } from 'react-icons/hi2';

import { useExplanation } from './hooks/useExplanation';

import type { ExplanationToolProps } from 'features';

const DRAWER_WIDTH = 500; // Width of the explanation drawer on desktop (px)
const DRAWER_Z_INDEX = 1300; // Z-index to ensure drawer appears above other content


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
    const { explain, explanation, loading, error } = useExplanation();


    const [showDefinition, setShowDefinition] = useState(false);
    const cleanedWord = useMemo(() => removeTrailingPunctuation(word), [word]);

    const handleDefine = useCallback(async () => {
        console.log(`Requesting explanation for meta text ID: ${chunk}, word: ${cleanedWord}`);
        const result = await explain({
            words: cleanedWord,
            context: chunk.text,
            metatext_id: chunk.metatext_id,
            chunk_id: null
        });
        if (result) {
            setShowDefinition(true);
        }
    }, [cleanedWord, chunk.text, chunk.metatext_id, explain]);

    const handleCloseDefinition = useCallback(() => {
        setShowDefinition(false);
        // Only call onComplete if we have a valid explanation
        if (explanation) {
            onComplete?.(true, explanation);
        } else {
            onComplete?.(false, undefined);
        }
    }, [explanation, onComplete]);

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
