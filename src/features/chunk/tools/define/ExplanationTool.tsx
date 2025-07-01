import React, { useState } from 'react';
import {
    IconButton,
    Tooltip,
    Drawer,
    Box,
    Typography,
    Divider,
    CircularProgress,
    Alert
} from '@mui/material';
import { QuestionMarkIcon } from 'icons';
import { useExplanation } from 'hooks';
import { WordToolProps } from '../types';

interface ExplanationToolProps extends WordToolProps {
    onComplete?: (success: boolean, result?: any) => void;
}

/**
 * Explanation Tool Component
 * Provides word explanation with context
 */
const ExplanationTool: React.FC<ExplanationToolProps> = ({
    word, // The word or words to explain
    chunk,
    onComplete
}) => {
    const { explain, explanation, loading, error } = useExplanation();
    const [showDefinition, setShowDefinition] = useState(false);

    // Strip punctuation from word
    const stripPunctuation = (text: string): string => {
        return text.replace(/[^\u0000-\u007F\w\s]/g, '').trim();
    };

    const handleDefine = async () => {
        const cleanedWord = stripPunctuation(word);
        const result = await explain({
            words: cleanedWord,
            context: chunk.text,
            metaTextId: chunk.meta_text_id,
            chunkId: null
        });
        if (result) {
            setShowDefinition(true);
        }
        onComplete?.(!!result, result);
    };

    const handleCloseDefinition = () => {
        setShowDefinition(false);
    };

    return (
        <>
            <Tooltip title={`Define "${stripPunctuation(word)}"`}>
                <IconButton
                    onClick={handleDefine}
                    size="small"
                    disabled={loading}
                    aria-label={`Define ${stripPunctuation(word)}`}
                >
                    {loading ? <CircularProgress /> : <QuestionMarkIcon />}
                </IconButton>
            </Tooltip>

            <Drawer
                anchor="right"
                open={showDefinition}
                onClose={handleCloseDefinition}
                sx={{ zIndex: 1300 }}
            >
                <Box sx={{ width: 500, p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Explaining: {stripPunctuation(word)}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

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

                    {explanation?.explanationWithContext && (
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Explanation in Context:
                            </Typography>
                            <Typography variant="body2">
                                {explanation.explanationWithContext}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Drawer>
        </>
    );
};

export default ExplanationTool;
