// A Button component that opens a dialog with information about a word

import React, { useState } from 'react';
import { Dialog } from '@chakra-ui/react';
import { IconButton, Text, Box } from '@chakra-ui/react';
import { Tooltip } from '@components/ui/tooltip'
interface InfoButtonProps {
    icon: React.ReactElement;
    dialogId: string;
    title: string;
    word: string;
    content: string | React.ReactNode;
}

export function InfoButton(props: InfoButtonProps) {
    const {
        icon,
        dialogId,
        word,
        title,
        content,
    } = props;
    const [open, setOpen] = useState(false);
    const handleDialogOpen = () => setOpen(true);
    const _handleDialogClose = () => setOpen(false);

    return (
        <>
            <Tooltip content={title}>
                <IconButton
                    color="secondary"
                    aria-controls={open ? dialogId : undefined}
                    aria-haspopup="dialog"
                    onClick={handleDialogOpen}
                >
                    {icon}
                </IconButton>
            </Tooltip>
            <Dialog.Root
                id={dialogId}
                open={open}
                aria-labelledby={`${dialogId}-title`}
            >
                <Dialog.Title id={`${dialogId}-title`}>Word: {word}</Dialog.Title>
                <Dialog.Content>
                    <Text>{title}</Text>
                    <Text>{content}</Text>
                </Dialog.Content>
            </Dialog.Root>
        </>
    );
};

export default InfoButton;
