import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Heading, Box } from '@styles';


// Minimal inline styles so the unstyled Radix Dialog is visible and usable.
const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    zIndex: 50,
};

const contentStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'black',
    padding: '24px',
    borderRadius: 8,
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'auto',
    zIndex: 60,
};

const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: 8,
    right: 8,
    background: 'transparent',
    border: 'none',
    fontSize: 18,
    cursor: 'pointer',
};


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
                <Dialog.Overlay style={overlayStyle} />
                <Dialog.Content style={contentStyle}>
                    <Dialog.Title asChild>
                        <Heading>{title}</Heading>
                    </Dialog.Title>
                    {children}
                    <Dialog.Close asChild>
                        <button aria-label="Close" style={closeButtonStyle}>✕</button>
                    </Dialog.Close>
                </Dialog.Content>
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
                <Dialog.Overlay style={overlayStyle} />
                <Dialog.Content style={contentStyle}>
                    <Dialog.Title asChild>
                        <Heading>{title}</Heading>
                    </Dialog.Title>
                    <Box>{children}</Box>
                    <Dialog.Close asChild>
                        <button aria-label="Close" style={closeButtonStyle}>✕</button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
