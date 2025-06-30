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
import { useDefineWord } from './useDefineWord';
import { DefineWordToolProps } from '../types';

interface DefineWordToolComponentProps extends DefineWordToolProps {
    onComplete?: (success: boolean, result?: any) => void;
}

/**
 * Define Word Tool Component
 * Provides word definition with context
 */
const DefineWordTool: React.FC<DefineWordToolComponentProps> = ({
    word,
    context,
    chunk,
    onComplete
}) => {
    const { defineWord, loading, error } = useDefineWord();
    const [showDefinition, setShowDefinition] = useState(false);
    const [definition, setDefinition] = useState<string | null>(null);
    const [definitionWithContext, setDefinitionWithContext] = useState<string | null>(null);

    // Strip punctuation from word
    const stripPunctuation = (text: string): string => {
        return text.replace(/[^\w\s]/g, '').trim();
    };

    const handleDefine = async () => {
        const cleanedWord = stripPunctuation(word);

        const result = await defineWord({
            word: cleanedWord,
            context,
            chunk,
            chunkIdx: 0, // Not used for definition
            wordIdx: 0   // Not used for definition
        });

        if (result.success && result.data) {
            setDefinition(result.data.definition);
            setDefinitionWithContext(result.data.definitionWithContext);
            setShowDefinition(true);
        }

        onComplete?.(result.success, result.data);
    };

    const handleCloseDefinition = () => {
        setShowDefinition(false);
        setDefinition(null);
        setDefinitionWithContext(null);
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
                    {loading ? <CircularProgress size={20} /> : <QuestionMarkIcon />}
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
                        Definition: {stripPunctuation(word)}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {definition && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                General Definition:
                            </Typography>
                            <Typography variant="body2" paragraph>
                                {definition}
                            </Typography>
                        </Box>
                    )}

                    {definitionWithContext && (
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>
                                Definition in Context:
                            </Typography>
                            <Typography variant="body2">
                                {definitionWithContext}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Drawer>
        </>
    );
};

export default DefineWordTool;
