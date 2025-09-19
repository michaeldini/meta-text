import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Heading, Box, styled, IconWrapper } from '@styles';
import { HiXCircle } from 'react-icons/hi2';

// Stitches-styled Radix primitives
const Overlay = styled(Dialog.Overlay, {
    position: 'fixed',
    inset: 0,
    // overlay remains partially transparent for modal backdrop
    background: 'rgba(0,0,0,0.45)',
    zIndex: 50,
});

const Content = styled(Dialog.Content, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // // Use theme tokens so dialogs are opaque and follow the design system
    background: '$colors$altBackground',
    color: '$colors$altText',
    padding: '24px',
    borderRadius: 8,
    border: '1px solid $colors$border',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'auto',
    zIndex: 60,
});


export interface SimpleDialogProps {
    triggerButton: React.ReactNode
    title: string
    children: React.ReactNode
}

export function SimpleDialog({ triggerButton, title, children }: SimpleDialogProps) {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                {triggerButton}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Overlay />
                <Content>
                    <Dialog.Close asChild>
                        <IconWrapper>
                            <HiXCircle />
                        </IconWrapper>
                    </Dialog.Close>
                    <Dialog.Title asChild>
                        <Heading>{title}</Heading>
                    </Dialog.Title>
                    {children}
                </Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export interface ControlledDialogProps {
    open: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

export function ControlledDialog({ open, onClose, title, children }: ControlledDialogProps) {
    // placement/size props intentionally ignored — unstyled dialog
    return (
        <Dialog.Root open={open} onOpenChange={val => { if (!val) onClose(); }} >
            <Dialog.Portal>
                <Overlay />
                <Content>
                    <Dialog.Close asChild>
                        <IconWrapper>
                            <HiXCircle />
                        </IconWrapper>
                    </Dialog.Close>
                    <Dialog.Title asChild>
                        <Heading>{title}</Heading>
                    </Dialog.Title>
                    <Box>{children}</Box>
                </Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
