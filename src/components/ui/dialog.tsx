import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as ToolTipPrimitive from "@radix-ui/react-tooltip";
import { Heading, Box, styled, IconWrapper, keyframes } from '@styles';
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


const tooltipFade = keyframes({
    '0%': { opacity: 0, transform: 'translateY(4px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
});
const TooltipContent = styled(ToolTipPrimitive.Content, {
    background: '$colors$altBackground',
    color: '$colors$primary',
    padding: '8px 10px',
    border: '2px solid $colors$primary',
    borderRadius: '6px',
    fontSize: '1.1rem',
    boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
    animation: `${tooltipFade} 160ms ease`,
    zIndex: 1000,
});

export interface SimpleDialogProps {
    triggerButton: React.ReactNode
    tooltip: React.ReactNode
    title: string
    children: React.ReactNode
}

export function SimpleDialog({ triggerButton, tooltip, title, children }: SimpleDialogProps) {
    return (
        <ToolTipPrimitive.Provider>
            <Dialog.Root>
                <ToolTipPrimitive.Root>
                    <ToolTipPrimitive.Trigger asChild>
                        <Dialog.Trigger asChild>
                            {triggerButton}
                        </Dialog.Trigger>
                    </ToolTipPrimitive.Trigger>
                    <TooltipContent side="top" align="center" sideOffset={10}>
                        {tooltip}
                    </TooltipContent>
                </ToolTipPrimitive.Root>
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
        </ToolTipPrimitive.Provider >
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
