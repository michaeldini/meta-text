// A Button component that opens a dialog with information about a word

import React, { useState } from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent, Typography, Tooltip } from '@mui/material';

interface InfoButtonProps {
    icon: React.ReactElement;
    dialogId: string;
    title: string;
    word: string;
    content: string | React.ReactNode;
    typographyVariant?: 'body1' | 'body2';
}

export function InfoButton(props: InfoButtonProps) {
    const {
        icon,
        dialogId,
        word,
        title,
        content,
        typographyVariant = 'body2',
    } = props;
    const [open, setOpen] = useState(false);
    const handleDialogOpen = () => setOpen(true);
    const handleDialogClose = () => setOpen(false);

    return (
        <>
            <Tooltip title={title} arrow>
                <IconButton
                    size="small"
                    color="secondary"
                    aria-controls={open ? dialogId : undefined}
                    aria-haspopup="dialog"
                    onClick={handleDialogOpen}
                >
                    {icon}
                </IconButton>
            </Tooltip>
            <Dialog
                id={dialogId}
                open={open}
                onClose={handleDialogClose}
                aria-labelledby={`${dialogId}-title`}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle id={`${dialogId}-title`}>Word: {word}</DialogTitle>
                <DialogContent>
                    <Typography variant='subtitle1' sx={{ mb: 6 }}>{title}</Typography>
                    <Typography variant={typographyVariant} sx={{ whiteSpace: 'pre-line' }}>{content}</Typography>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default InfoButton;
