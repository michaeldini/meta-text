
import React, { useState, useCallback, useMemo } from 'react';
import {
    IconButton,
    Tooltip,
    Drawer,
    Box,
    Typography,
    Divider,
} from '@mui/material';
import { QuestionMarkIcon } from 'icons';
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
            <Tooltip title={`Define "${cleanedWord}"`}>
                <IconButton
                    onClick={handleDefine}
                    size="small"
                    disabled={loading}
                    aria-label={`Define ${cleanedWord}`}
                >
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <QuestionMarkIcon />
                    )}
                </IconButton>
            </Tooltip>

            {/* Explanation Drawer*/}
            <Drawer
                anchor="right"
                open={showDefinition}
                onClose={handleCloseDefinition}
                role="dialog"
                aria-labelledby="explanation-title"
                aria-describedby="explanation-content"
                sx={{
                    zIndex: DRAWER_Z_INDEX,
                    '& .MuiDrawer-paper': {
                        width: { xs: '100vw', sm: DRAWER_WIDTH },
                        maxWidth: '90vw'
                    }
                }}
            >
                <Box sx={{ p: 3 }}>
                    {/* Drawer Header */}
                    <Typography
                        id="explanation-title"
                        variant="h6"
                        gutterBottom
                    >
                        Explaining: {cleanedWord}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {/*  Error State Display  */}
                    {error && (
                        <AppAlert severity="error">
                            {error}
                        </AppAlert>
                    )}

                    {/* Explanation Content Area */}
                    <Box id="explanation-content">
                        {explanation?.explanation && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    General Explanation:
                                </Typography>
                                <Typography variant="body2" paragraph>
                                    {explanation.explanation}
                                </Typography>
                            </Box>
                        )}

                        {explanation?.explanation_in_context && (
                            <Box>
                                <Typography variant="subtitle2" gutterBottom>
                                    Explanation in Context:
                                </Typography>
                                <Typography variant="body2">
                                    {explanation.explanation_in_context}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Drawer>
        </>
    );
});

WordsExplanationTool.displayName = 'WordsExplanationTool';

export default WordsExplanationTool;
