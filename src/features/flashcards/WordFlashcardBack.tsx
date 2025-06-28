import React, { useMemo } from 'react';
import { Box, CardActionArea, CardContent, Typography, useTheme } from '@mui/material';
import { MenuIcon, QuestionMarkIcon } from '../../components/icons';
import { createWordFlashcardStyles } from './WordFlashcard.styles';
import InfoButton from './InfoPopoverButton';

interface WordFlashcardBackProps {
    word: string;
    definition: string;
    definitionWithContext: string;
    context?: string;
    setFlipped: any;
}

const WordFlashcardBack: React.FC<WordFlashcardBackProps> = ({
    word,
    definition,
    definitionWithContext,
    context,
    setFlipped
}) => {
    const theme = useTheme();
    const styles = useMemo(() => createWordFlashcardStyles(theme), [theme]);

    return (
        <CardContent sx={styles.back}>
            <CardActionArea
                sx={styles.cardActionArea}
                onClick={() => setFlipped(false)}
            >
                <Typography variant="h5" fontWeight={700} color={theme.palette.text.secondary}>{word}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>{definition}</Typography>
            </CardActionArea>
            <Box sx={styles.buttonsContainer}>
                <InfoButton
                    icon={<MenuIcon />}
                    dialogId="info-dialog"
                    title="Definition with Context"
                    word={word}
                    content={definitionWithContext}
                    typographyVariant="body1"
                />
                <InfoButton
                    icon={<QuestionMarkIcon />}
                    dialogId="context-dialog"
                    title="Context"
                    word={word}
                    content={context || 'No context available'}
                    typographyVariant="body1"
                />
            </Box>
        </CardContent>
    );
};

export default WordFlashcardBack;
