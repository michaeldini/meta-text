import React, { useState } from 'react';
import { Popover, Box, IconButton, Alert, CircularProgress } from '@mui/material';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { fetchDefinitionInContext } from '../../../services/aiService';

export interface WordActionDialogProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    word: string;
    onSplit: () => void;
    context: string;
    metaTextId: string | number | undefined;
}

const WordActionDialog: React.FC<WordActionDialogProps> = ({ anchorEl, onClose, word, onSplit, context, metaTextId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showDefinition, setShowDefinition] = useState(false);
    const [definition, setDefinition] = useState<string | null>(null);
    const [definitionWithContext, setDefinitionWithContext] = useState<string | null>(null);

    const open = Boolean(anchorEl);

    const handleFetchDefinitionInContext = async () => {
        setLoading(true);
        setError('');
        setShowDefinition(false);
        setDefinition(null);
        setDefinitionWithContext(null);
        try {
            if (typeof metaTextId !== 'number') {
                throw new Error('Invalid metaTextId');
            }
            const result = await fetchDefinitionInContext(word, context, metaTextId);
            setDefinition(result.definition);
            setDefinitionWithContext(result.definitionWithContext);
            setShowDefinition(true);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch definition in context');
            setShowDefinition(true);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setShowDefinition(false);
        setError('');
        setDefinition(null);
        setDefinitionWithContext(null);
        onClose();
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
            transformOrigin={{ vertical: 'center', horizontal: 'left' }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 1, p: 1 }}>
                <IconButton onClick={onSplit} disabled={loading} title="Split text here" color="primary">
                    <ContentCutIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={handleFetchDefinitionInContext} disabled={loading} title="AI: Definition in context" color="secondary">
                    {loading ? (
                        <CircularProgress size={20} />
                    ) : (
                        <QuestionMarkIcon fontSize="small" />
                    )}
                </IconButton>
            </Box>
            {/* ...rest of the dialog rendering... */}
        </Popover>
    );
};

export default WordActionDialog;
