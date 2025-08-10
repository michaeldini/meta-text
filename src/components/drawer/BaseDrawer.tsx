// BaseDrawer component
// Centralizes Chakra Drawer structure (Root, Portal, Backdrop, Positioner, Content, Header, Body, Footer)
// for consistent styling and behavior across feature-specific drawers.
import React from 'react';
import { Drawer } from '@chakra-ui/react/drawer';
import { Portal } from '@chakra-ui/react/portal';
import { CloseButton } from '@chakra-ui/react/button';
import { Stack } from '@chakra-ui/react/stack';
import { Box } from '@chakra-ui/react/box';
import { Text } from '@chakra-ui/react/text';

export interface BaseDrawerProps {
    open: boolean;
    onClose: () => void;
    title?: React.ReactNode;
    maxW?: string | number;
    // Chakra v3 Drawer placements
    placement?: 'start' | 'end' | 'top' | 'bottom';
    children: React.ReactNode;
    footer?: React.ReactNode;
    showCloseButton?: boolean;
    error?: string | null;
    bodyGap?: number;
    // Advanced customization hooks for specific drawers (optional, keeps component flexible)
    contentProps?: React.ComponentProps<typeof Drawer.Content>;
    bodyProps?: React.ComponentProps<typeof Drawer.Body>;
}

export function BaseDrawer({
    open,
    onClose,
    title,
    maxW = 'sm',
    placement = 'end',
    children,
    footer,
    showCloseButton = true,
    error,
    bodyGap = 4,
    contentProps,
    bodyProps
}: BaseDrawerProps) {
    return (
        <Drawer.Root open={open} onOpenChange={e => { if (!e.open) onClose(); }} placement={placement}>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content maxW={maxW} w="full" {...contentProps}>
                        {title && (
                            <Drawer.Header>
                                <Drawer.Title>{title}</Drawer.Title>
                                {showCloseButton && (
                                    <Drawer.CloseTrigger asChild>
                                        <CloseButton />
                                    </Drawer.CloseTrigger>
                                )}
                            </Drawer.Header>
                        )}
                        <Drawer.Body {...bodyProps}>
                            <Stack gap={bodyGap}>
                                {error && (
                                    <Box bg="red.50" borderRadius="md" p={3}>
                                        <Text color="red.600" fontSize="sm">{error}</Text>
                                    </Box>
                                )}
                                {children}
                            </Stack>
                        </Drawer.Body>
                        {footer && (
                            <Drawer.Footer>
                                {footer}
                            </Drawer.Footer>
                        )}
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
}

export default BaseDrawer;
