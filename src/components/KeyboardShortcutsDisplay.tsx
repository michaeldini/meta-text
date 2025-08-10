import { Icon } from '@components/icons/Icon';
/** 
 * Component to display all available keyboard shortcuts in a drawer
 * Useful for help dialogs or documentation.
 */
import React, { useState } from 'react';
import { Box, Text, VStack, HStack, Badge } from '@chakra-ui/react';
import { getShortcutsByCategory, formatShortcut, type KeyboardShortcut } from '@utils/keyboardShortcuts';
import { IconButton } from "@chakra-ui/react/button"
import { Drawer } from "@chakra-ui/react/drawer"
import { CloseButton } from '@chakra-ui/react/button'


interface ShortcutItemProps {
    shortcut: KeyboardShortcut;
}

const ShortcutItem = ({ shortcut }: ShortcutItemProps) => (
    <HStack justify="end" w="full">
        <Text fontSize="sm">{shortcut.description}</Text>
        <Badge color="fg" variant="outline" fontFamily="mono" fontSize="xs">
            {formatShortcut(shortcut)}
        </Badge>
    </HStack>
);

interface KeyboardShortcutsDisplayProps {
    categories?: string[];
}

/**
 * Displays all keyboard shortcuts grouped by category
 */
export const KeyboardShortcutsDisplay = ({ categories }: KeyboardShortcutsDisplayProps) => {
    const shortcutsByCategory = getShortcutsByCategory();

    const categoriesToShow = categories || Object.keys(shortcutsByCategory);

    return (
        <>
            {/* Help icon to open a drawer with placeholder content */}
            <HelpDrawerTrigger />
            <VStack align="start" gap={4} w="full">
                {categoriesToShow.map(category => {
                    const shortcuts = shortcutsByCategory[category];
                    if (!shortcuts?.length) return null;

                    return (
                        <Box key={category} w="full">
                            <Text fontWeight="semibold" mb={2} color="fg">
                                {category}
                            </Text>
                            <VStack align="center" gap={1} pl={4}>
                                {shortcuts.map((shortcut: KeyboardShortcut, index: number) => (
                                    <ShortcutItem key={index} shortcut={shortcut} />
                                ))}
                            </VStack>
                        </Box>
                    );
                })}
            </VStack>
        </>
    );
};

// Local helper component to render a question-mark IconButton that toggles a Drawer with filler content
export const HelpDrawerTrigger = () => {
    const [open, setOpen] = useState(false);
    // Build the keyboard shortcuts content for the drawer
    const shortcutsByCategory = getShortcutsByCategory();
    const categoriesToShow = Object.keys(shortcutsByCategory);

    return (
        <Box display="flex" justifyContent="flex-end">
            <IconButton aria-label="Open help" variant="ghost" onClick={() => setOpen(true)} color="primary">
                <Icon name='Help' />
            </IconButton>
            <Drawer.Root open={open} onOpenChange={({ open }) => setOpen(open)} placement="end" size="sm">
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header display="flex" alignItems="center" justifyContent="space-between">
                            <Drawer.Title>Help</Drawer.Title>
                            <Drawer.CloseTrigger asChild>
                                <CloseButton />
                            </Drawer.CloseTrigger>
                        </Drawer.Header>
                        <Drawer.Body>
                            <VStack align="start" gap={4} w="full">
                                <Text color="fg">Keyboard Shortcuts</Text>
                                <Text fontSize="sm" color="fg.muted">Use these shortcuts to speed up your workflow.</Text>
                                {categoriesToShow.map(category => {
                                    const shortcuts = shortcutsByCategory[category];
                                    if (!shortcuts?.length) return null;
                                    return (
                                        <Box key={category} w="full">
                                            <Text fontWeight="semibold" mb={2} color="fg">
                                                {category}
                                            </Text>
                                            <VStack align="flex" gap={1} pl={4}>
                                                {shortcuts.map((shortcut: KeyboardShortcut, index: number) => (
                                                    <ShortcutItem key={index} shortcut={shortcut} />
                                                ))}
                                            </VStack>
                                        </Box>
                                    );
                                })}
                            </VStack>
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Drawer.Root>
        </Box>
    );
};

