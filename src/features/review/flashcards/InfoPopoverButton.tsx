import React, { useState } from 'react';
import { IconButton, Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';

interface InfoButtonProps {
    icon: React.ReactElement;
    dialogId: string;
    title: string;
    word: string;
    content: string;
    typographyVariant?: 'body1' | 'body2';
}

const InfoButton: React.FC<InfoButtonProps> = ({
    icon,
    dialogId,
    word,
    title,
    content,
    typographyVariant = 'body2',
}) => {
    const [open, setOpen] = useState(false);
    const handleDialogOpen = () => setOpen(true);
    const handleDialogClose = () => setOpen(false);

    return (
        <>
            <IconButton
                size="small"
                color="secondary"
                aria-controls={open ? dialogId : undefined}
                aria-haspopup="dialog"
                onClick={handleDialogOpen}
            >
                {icon}
            </IconButton>
            <Dialog
                id={dialogId}
                open={open}
                onClose={handleDialogClose}
                aria-labelledby={`${dialogId}-title`}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle id={`${dialogId}-title`}>{title}</DialogTitle>
                <DialogContent>
                    <Typography variant='subtitle1' sx={{ mb: 6 }}>{word}</Typography>
                    <Typography variant={typographyVariant} sx={{ whiteSpace: 'pre-line' }}>{content}</Typography>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default InfoButton;
