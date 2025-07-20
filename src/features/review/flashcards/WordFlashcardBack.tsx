// Back of a flashcard component that displays the definition and context of a word

import React from 'react';
import { Box, CardActionArea, CardContent, Typography, useTheme } from '@mui/material';
import { MenuIcon, QuestionMarkIcon } from 'icons';
import { createWordFlashcardStyles } from './WordFlashcard.styles';
import InfoButton from './InfoPopoverButton';
import parse from 'html-react-parser';

interface WordFlashcardBackProps {
    word: string;
    definition: string;
    definition_in_context: string;
    context: string;
    setFlipped: any;
}

const WordFlashcardBack: React.FC<WordFlashcardBackProps> = ({
    word,
    definition,
    definition_in_context,
    context,
    setFlipped
}) => {
    const theme = useTheme();
    const styles = createWordFlashcardStyles(theme);
    const highlightedText: string = context.replace(new RegExp(`(${word})`, 'gi'), '<mark>$1</mark>');

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
                    title="Definition In Context"
                    word={word}
                    content={definition_in_context}
                    typographyVariant="body2"
                />
                <InfoButton
                    icon={<QuestionMarkIcon />}
                    dialogId="context-dialog"
                    title="Context"
                    word={word}
                    content={parse(highlightedText)}
                    typographyVariant="body2"
                />
            </Box>
        </CardContent>
    );
};

export default WordFlashcardBack;
