import React, { useState, useMemo } from 'react';
import { Box, Typography, IconButton, Popover, useTheme } from '@mui/material';
import { QuestionMarkIcon, } from './icons';
import { MenuIcon } from './icons';
import { createWordFlashcardStyles } from './WordFlashcard.styles';

interface WordFlashcardProps {
    word: string;
    definition: string;
    definitionWithContext: string;
    context?: string;
}

const WordFlashcard: React.FC<WordFlashcardProps> = ({ word, definition, definitionWithContext, context }) => {
    const [flipped, setFlipped] = useState(false);
    const [anchorInfo, setAnchorInfo] = useState<null | HTMLElement>(null);
    const [anchorContext, setAnchorContext] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const styles = useMemo(() => createWordFlashcardStyles(theme), [theme]);

    // Info popover handlers (MUI docs pattern)
    const handlePopoverOpenInfo = (event: React.MouseEvent<HTMLElement>) => setAnchorInfo(event.currentTarget);
    const handlePopoverCloseInfo = () => setAnchorInfo(null);
    const openInfo = Boolean(anchorInfo);

    // Context popover handlers (MUI docs pattern)
    const handlePopoverOpenContext = (event: React.MouseEvent<HTMLElement>) => setAnchorContext(event.currentTarget);
    const handlePopoverCloseContext = () => setAnchorContext(null);
    const openContext = Boolean(anchorContext);

    return (
        <Box sx={styles.flashcardContainer} onClick={() => setFlipped(f => !f)}>
            <Box sx={{ ...styles.flashcard, ...(flipped ? styles.flipped : {}) }}>
                {/* Front Side */}
                <Box sx={styles.front} onClick={e => { e.stopPropagation(); setFlipped(true); }}>
                    <Typography variant="h4" fontWeight={700} align="center">{word}</Typography>
                </Box>
                {/* Back Side */}
                <Box sx={styles.back} onClick={e => { e.stopPropagation(); setFlipped(false); }}>
                    <Typography variant="h5" fontWeight={700} align="center" color={theme.palette.text.secondary}>{word}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>{definition}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'center' }}>
                        <IconButton
                            size="small"
                            color="secondary"
                            aria-owns={openInfo ? 'info-popover' : undefined}
                            aria-haspopup="true"
                            onMouseEnter={handlePopoverOpenInfo}
                            onMouseLeave={handlePopoverCloseInfo}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Popover
                            id="info-popover"
                            sx={{ pointerEvents: 'none' }}
                            open={openInfo}
                            anchorEl={anchorInfo}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            onClose={handlePopoverCloseInfo}
                            disableRestoreFocus
                        >
                            <Typography sx={{ p: 1 }} variant="subtitle2" gutterBottom>Definition with Context</Typography>
                            <Typography sx={{ p: 1, whiteSpace: 'pre-line' }} variant="body2">{definitionWithContext}</Typography>
                        </Popover>
                        <IconButton
                            size="small"
                            color="secondary"
                            aria-owns={openContext ? 'context-popover' : undefined}
                            aria-haspopup="true"
                            onMouseEnter={handlePopoverOpenContext}
                            onMouseLeave={handlePopoverCloseContext}
                        >
                            <QuestionMarkIcon />
                        </IconButton>
                        <Popover
                            id="context-popover"
                            sx={{ pointerEvents: 'none' }}
                            open={openContext}
                            anchorEl={anchorContext}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            onClose={handlePopoverCloseContext}
                            disableRestoreFocus
                        >
                            <Typography sx={{ p: 1 }} variant="subtitle2" gutterBottom>Context</Typography>
                            <Typography sx={{ p: 1, whiteSpace: 'pre-line' }} variant="body1">{context || 'No context available'}</Typography>
                        </Popover>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default WordFlashcard;
