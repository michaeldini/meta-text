/** Used on Homepage TODO: place in a better place, underneath a ? icon 
 * Component to display all available keyboard shortcuts.
 * Useful for help dialogs or documentation.
 */
import { Box, Text, VStack, HStack, Badge } from '@chakra-ui/react';
import { getShortcutsByCategory, formatShortcut, type KeyboardShortcut } from '../utils/keyboardShortcuts';

interface ShortcutItemProps {
    shortcut: KeyboardShortcut;
}

const ShortcutItem = ({ shortcut }: ShortcutItemProps) => (
    <HStack justify="center" w="full">
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
        <VStack align="start" gap={4} w="full">
            {categoriesToShow.map(category => {
                const shortcuts = shortcutsByCategory[category];
                if (!shortcuts?.length) return null;

                return (
                    <Box key={category} w="full">
                        <Text fontWeight="semibold" mb={2} color="fg">
                            {category}
                        </Text>
                        <VStack align="start" gap={1} pl={4}>
                            {shortcuts.map((shortcut: KeyboardShortcut, index: number) => (
                                <ShortcutItem key={index} shortcut={shortcut} />
                            ))}
                        </VStack>
                    </Box>
                );
            })}
        </VStack>
    );
};
