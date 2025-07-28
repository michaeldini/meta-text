
import React, { useState, useCallback, useMemo } from 'react';
import {
    Drawer,
    Box,
    Text,
    Heading,
} from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { TooltipButton } from 'components';
import { HiQuestionMarkCircle } from 'react-icons/hi2';
import { useExplanation } from './hooks/useExplanation';
import { LoadingSpinner, AppAlert } from 'components';
import type { ExplanationToolProps } from 'features/chunk-shared/types';

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
            {/* Question Mark Icon Button*/}
            <TooltipButton
                label={`Define "${cleanedWord}"`}
                onClick={handleDefine}
                disabled={loading}
                aria-label={`Define ${cleanedWord}`}
                icon={loading ? (
                    <LoadingSpinner />
                ) : (
                    <HiQuestionMarkCircle />
                )}
                data-testid={`explain-word-${cleanedWord}`}
            />
            {/* Explanation Drawer*/}
            <Drawer.Root
                open={showDefinition}
                // onClose={handleCloseDefinition}
                role="dialog"
                aria-labelledby="explanation-title"
                aria-describedby="explanation-content"

            >
                <Box divideX="2px">
                    {/* Drawer Header */}
                    <Heading
                        id="explanation-title"
                    >
                        Explaining: {cleanedWord}
                    </Heading>

                    {/*  Error State Display  */}
                    {error && (
                        <AppAlert severity="error">
                            {error}
                        </AppAlert>
                    )}

                    {/* Explanation Content Area */}
                    <Box id="explanation-content">
                        {explanation?.explanation && (
                            <Box >
                                <Heading >
                                    General Explanation:
                                </Heading>
                                <Text>
                                    {explanation.explanation}
                                </Text>
                            </Box>
                        )}

                        {explanation?.explanation_in_context && (
                            <Box>
                                <Heading >
                                    Explanation in Context:
                                </Heading>
                                <Text>
                                    {explanation.explanation_in_context}
                                </Text>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Drawer.Root>
        </>
    );
});

WordsExplanationTool.displayName = 'WordsExplanationTool';

export default WordsExplanationTool;
