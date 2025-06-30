import React, { memo } from 'react';
import { Popover, Box, useTheme } from '@mui/material';
import SplitChunkTool from '../tools/split/SplitChunkTool';
import DefineWordTool from '../tools/define/DefineWordTool';
import ExplainPhraseTool from '../tools/explain/ExplainPhraseTool';
import { getWordsStyles } from './Words.styles';
export interface WordActionDialogProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    word: string;
    wordIdx: number;
    chunkIdx: number;
    context: string;
    metaTextId: string | number | undefined;
    isPhrase?: boolean;
}

/**
 * WordActionDialog - Layout component that presents word-level tools
 * This is a layout component that uses the split and define tools
 */
const WordActionDialog: React.FC<WordActionDialogProps> = memo(({
    anchorEl,
    onClose,
    word,
    wordIdx,
    chunkIdx,
    context,
    metaTextId,
    isPhrase = false
}) => {
    const theme = useTheme();
    const styles = getWordsStyles(theme);
    const open = Boolean(anchorEl);

    const chunk = {
        meta_text_id: metaTextId
    };

    const handleSplitToolComplete = (success: boolean, result?: any) => {
        if (success) {
            console.log('Split tool completed successfully:', result);
            onClose();
        }
    };

    const handleDefineToolComplete = (success: boolean, result?: any) => {
        if (success) {
            console.log('Define tool completed successfully:', result);
            // Don't close the dialog - let the define tool manage its own drawer
        }
    };

    const handleExplainPhraseToolComplete = (success: boolean, result?: any) => {
        if (success) {
            console.log('Explain phrase tool completed successfully:', result);
            // Don't close the dialog - let the explain tool manage its own drawer
        }
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <Box sx={styles.wordActionDialogContainer}>
                {isPhrase ? (
                    <ExplainPhraseTool
                        chunkIdx={chunkIdx}
                        phrase={word}
                        context={context}
                        chunk={chunk}
                        onComplete={handleExplainPhraseToolComplete}
                        metaTextId={chunk.meta_text_id}
                    />
                ) : (
                    <>
                        <SplitChunkTool
                            chunkIdx={chunkIdx}
                            wordIdx={wordIdx}
                            word={word}
                            context={context}
                            chunk={chunk}
                            onComplete={handleSplitToolComplete}
                        />
                        <DefineWordTool
                            chunkIdx={chunkIdx}
                            wordIdx={wordIdx}
                            word={word}
                            context={context}
                            chunk={chunk}
                            onComplete={handleDefineToolComplete}
                        />
                    </>
                )}
            </Box>
        </Popover>
    );
});

WordActionDialog.displayName = 'WordActionDialog';

export default WordActionDialog;
