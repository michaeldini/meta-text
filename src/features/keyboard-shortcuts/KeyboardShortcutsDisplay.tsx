/** 
 * Button that shows a dialog with keyboard shortcuts.
 * 
 * The shortcuts are defined in the SHORTCUTS constant, keeping a single source of truth.
 * 
 * This component simply maps over the shortcuts and displays them in a dialog.
 */

import React from 'react';
import { type KeyboardShortcut, SHORTCUTS } from '@utils/keyboardShortcuts';
import { Box, Text, Column, TagRoot as Badge, Heading } from '@styles';
import TooltipButton from '@components/ui/TooltipButton';
import { HiQuestionMarkCircle } from 'react-icons/hi2';
import { SimpleDialog } from '@components/ui/dialog';

export function KeyboardShortcutsDisplay() {
    const shortcuts: KeyboardShortcut[] = Object.values(SHORTCUTS)

    return (
        <SimpleDialog
            title="Help"

            // Button to activate the dialog
            triggerButton={
                <TooltipButton
                    aria-label="Open help"
                    label=""
                    tooltip="Show keyboard shortcuts"
                    icon={<HiQuestionMarkCircle />}
                />
            }
        >

            {/* Dialog content */}
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