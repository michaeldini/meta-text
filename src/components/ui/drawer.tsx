import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { styled, keyframes } from '@styles';
export interface SimpleDrawerProps {
    triggerButton: React.ReactNode
    title: string
    children: React.ReactNode
    header?: React.ReactNode
    footer?: React.ReactNode
    placement?: 'start' | 'end' | 'top' | 'bottom'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function SimpleDrawer({ triggerButton, title, children, header, footer, placement = 'end', size = 'md' }: SimpleDrawerProps) {
    // keyframes for sliding in from sides
    const slideInRight = keyframes({ '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } });
    const slideInLeft = keyframes({ '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(0)' } });
    const slideInUp = keyframes({ '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(0)' } });
    const slideInDown = keyframes({ '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } });

    const Overlay = styled(Dialog.Overlay, {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 1000,
    });

    const Content = styled(Dialog.Content, {
        position: 'fixed',
        background: 'black',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        variants: {
            side: {
                end: { top: 0, right: 0, height: '100%', width: '320px', animation: `${slideInRight} 240ms cubic-bezier(.2,.8,.2,1)` },
                start: { top: 0, left: 0, height: '100%', width: '320px', animation: `${slideInLeft} 240ms cubic-bezier(.2,.8,.2,1)` },
                top: { top: 0, left: 0, right: 0, height: '320px', animation: `${slideInUp} 240ms cubic-bezier(.2,.8,.2,1)` },
                bottom: { bottom: 0, left: 0, right: 0, height: '320px', animation: `${slideInDown} 240ms cubic-bezier(.2,.8,.2,1)` },
            },
            size: {
                xs: { width: '200px', height: '200px' },
                sm: { width: '240px' },
                md: { width: '320px' },
                lg: { width: '420px' },
                xl: { width: '640px' },
                full: { width: '100%', height: '100%' },
            },
        },
        defaultVariants: { side: 'end', size: 'md' as any },
    });

    const Header = styled('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' });
    const Body = styled('div', { flex: 1, overflow: 'auto' });
    const Footer = styled('div', { marginTop: '8px' });
    const CloseBtn = styled('button', {
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: '6px',
        borderRadius: 6,
    });

    const side = placement === 'start' ? 'start' : placement === 'end' ? 'end' : placement === 'top' ? 'top' : 'bottom';

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                {triggerButton}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Overlay />
                <Content side={side as any} size={size as any} aria-label={title}>
                    <Header>
                        <Dialog.Title>{title}</Dialog.Title>
                        {header}
                    </Header>
                    <Body>{children}</Body>
                    <Footer>{footer}</Footer>
                    <Dialog.Close asChild>
                        <CloseBtn aria-label="Close">✕</CloseBtn>
                    </Dialog.Close>
                </Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export interface ControlledDrawerProps {
    open: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    header?: React.ReactNode
    footer?: React.ReactNode
    placement?: 'start' | 'end' | 'top' | 'bottom'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function ControlledDrawer({ open, onClose, title, children, header, footer, placement = 'end', size = 'md' }: ControlledDrawerProps) {
    const slideInRight = keyframes({ '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } });
    const slideInLeft = keyframes({ '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(0)' } });
    const slideInUp = keyframes({ '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(0)' } });
    const slideInDown = keyframes({ '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } });

    const Overlay = styled(Dialog.Overlay, {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
    });

    const Content = styled(Dialog.Content, {
        position: 'fixed',
        background: 'black',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        variants: {
            side: {
                end: { top: 0, right: 0, height: '100%', width: 'fit-content', padding: '16px', animation: `${slideInRight} 240ms cubic-bezier(.2,.8,.2,1)` },
                start: { top: 0, left: 0, height: '100%', width: '320px', animation: `${slideInLeft} 240ms cubic-bezier(.2,.8,.2,1)` },
                top: { top: 0, left: 0, right: 0, height: '320px', animation: `${slideInUp} 240ms cubic-bezier(.2,.8,.2,1)` },
                bottom: { bottom: 0, left: 0, right: 0, height: '320px', animation: `${slideInDown} 240ms cubic-bezier(.2,.8,.2,1)` },
            },
            size: {
                xs: { width: '200px', height: '200px' },
                sm: { width: '240px' },
                md: { width: '320px' },
                lg: { width: '420px' },
                xl: { width: '640px' },
                full: { width: '100%', height: '100%' },
            },
        },
        defaultVariants: { side: 'end', size: 'md' as any },
    });

    const Header = styled('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' });
    const Body = styled('div', { flex: 1, overflow: 'auto' });
    const Footer = styled('div', { marginTop: '8px' });
    const CloseBtn = styled('button', {
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: '6px',
        borderRadius: 6,
    });

    const side = placement === 'start' ? 'start' : placement === 'end' ? 'end' : placement === 'top' ? 'top' : 'bottom';

    return (
        <Dialog.Root open={open} onOpenChange={val => { if (!val) onClose(); }}>
            <Dialog.Portal>
                <Overlay />
                <Content side={side as any} size={size as any} aria-label={title}>
                    <Header>
                        <Dialog.Title>{title}</Dialog.Title>
                        {header}
                    </Header>
                    <Body>{children}</Body>
                    <Footer>{footer}</Footer>
                    <Dialog.Close asChild>
                        <CloseBtn aria-label="Close">✕</CloseBtn>
                    </Dialog.Close>
                </Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
