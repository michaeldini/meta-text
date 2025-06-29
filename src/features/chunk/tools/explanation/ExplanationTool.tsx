import React from 'react';
import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '@mui/material/styles';

import { AiGenerationButton } from 'components';
import { useExplanation } from './useExplanation';
import type { Chunk } from '../../../../types/chunk';
import { getExplanationStyles } from './Explanation.styles';

interface ExplanationToolProps {
    chunkIdx: number;
    chunk: Chunk;
    explanationText?: string;
    onExplanationUpdate?: (text: string) => void;
    onComplete?: (success: boolean, result?: any) => void;
}

const ExplanationTool: React.FC<ExplanationToolProps> = ({
    chunkIdx,
    chunk,
    explanationText = '',
    onExplanationUpdate,
    onComplete
}) => {
    const { generateExplanation, loading, error } = useExplanation();
    const theme = useTheme();
    const styles = getExplanationStyles(theme);

    const handleGenerate = async () => {
        const result = await generateExplanation({ chunkIdx, chunk });
        if (result.success && result.data) {
            onExplanationUpdate?.(result.data.explanationText);
        }
        onComplete?.(result.success, result.data);
    };

    return (
        <Box sx={styles.toolTabContainer}>
            <AiGenerationButton
                label="Explain This Chunk"
                toolTip="Generate a detailed, in-depth explanation of this chunk's text."
                loading={loading}
                onClick={handleGenerate}
                sx={{ ml: 1 }}
                disabled={loading || !chunk?.id}
            />
            <Box sx={styles.explanationTextContainer}>
                {explanationText ? (
                    <ReactMarkdown>{explanationText}</ReactMarkdown>
                ) : (
                    <span >No explanation yet.</span>
                )}
            </Box>
            {error && <Box sx={{ color: 'error.main', fontSize: 12 }}>{error}</Box>}
        </Box>
    );
};

export default ExplanationTool;
