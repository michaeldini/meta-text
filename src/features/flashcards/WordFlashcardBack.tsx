import React, { useMemo } from 'react';
import { Box, CardContent, Typography, useTheme } from '@mui/material';
import { MenuIcon, QuestionMarkIcon } from '../../components/icons';
import { createWordFlashcardStyles } from './WordFlashcard.styles';
import InfoPopoverButton from './InfoPopoverButton';

interface WordFlashcardBackProps {
    word: string;
    definition: string;
    definitionWithContext: string;
    context?: string;
}

const WordFlashcardBack: React.FC<WordFlashcardBackProps> = ({
    word,
    definition,
    definitionWithContext,
    context,
}) => {
    const theme = useTheme();
    const styles = useMemo(() => createWordFlashcardStyles(theme), [theme]);

    return (
        <Box sx={styles.back}>
            <CardContent>
                <Typography variant="h5" fontWeight={700} align="center" color={theme.palette.text.secondary}>{word}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>{definition}</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
                    <InfoPopoverButton
                        icon={<MenuIcon />}
                        popoverId="info-popover"
                        title="Definition with Context"
                        content={definitionWithContext}
                        typographyVariant="body1"
                    />
                    <InfoPopoverButton
                        icon={<QuestionMarkIcon />}
                        popoverId="context-popover"
                        title="Context"
                        content={context || 'No context available'}
                        typographyVariant="body1"
                    />
                </Box>
            </CardContent>
        </Box>
    );
};

export default WordFlashcardBack;
