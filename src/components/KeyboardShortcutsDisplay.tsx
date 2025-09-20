
import React from 'react';
import { Box, Text, Column, TagRoot as Badge, Heading } from '@styles';
import TooltipButton from '@components/ui/TooltipButton';
import { type KeyboardShortcut, SHORTCUTS } from '@utils/keyboardShortcuts';
import { HiQuestionMarkCircle } from 'react-icons/hi2';
import { SimpleDialog } from '@components/ui/dialog';


/**
 * Simplified KeyboardShortcutsDisplay
 * Renders a single dialog that lists all shortcuts (description + key)
 */
export function KeyboardShortcutsDisplay() {
    const shortcuts: KeyboardShortcut[] = Object.values(SHORTCUTS) as KeyboardShortcut[];

    return (
        <SimpleDialog
            triggerButton={
                <TooltipButton
                    aria-label="Open help"
                    label=""
                    tooltip="Show keyboard shortcuts"
                    icon={<HiQuestionMarkCircle />}
                />
            }
            title="Help"
        >
            <Column>
                <Heading>Keyboard Shortcuts</Heading>
                <Text>Use these shortcuts to speed up your workflow.</Text>
                <Column>
                    {shortcuts.map((s, i) => (
                        <Box key={i} css={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                            <Text>{s.description}</Text>
                            <Badge css={{ fontFamily: 'monospace' }}>{s.key}</Badge>
                        </Box>
                    ))}
                </Column>
            </Column>
        </SimpleDialog>
    );
}

export default KeyboardShortcutsDisplay;