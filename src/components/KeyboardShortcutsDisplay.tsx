/**
 * Keyboard Shortcut UI Components
 * =================================
 * This module exposes three React components used to surface application keyboard shortcuts
 * in a consistent, accessible way.
 *
 * Components
 * ----------
 * 1. KeyboardShortcutItem
 *    Renders a single shortcut: description + formatted key combo badge.
 * 2. KeyboardShortcutList
 *    Renders one or more shortcut categories (title + list of items). Omits empty categories.
 * 3. KeyboardShortcutsDisplay (primary export)
 *    Provides a help / "?" IconButton that opens a side drawer containing a categorized list of shortcuts.
 *
 * Data Source
 * -----------
 * All shortcut metadata is provided by `getShortcutsByCategory()` from `@utils/keyboardShortcuts`.
 * That utility centralizes definitions (key sequences, descriptions, categories). To add or modify
 * shortcuts, update the utility—no changes needed in this presentation layer unless layout changes.
 *
 * Quick Usage
 * -----------
 * import { KeyboardShortcutsDisplay } from '@components/KeyboardShortcutsDisplay';
 *
 * // Default: show all categories in drawer
 * <KeyboardShortcutsDisplay />
 *
 * // Filter to specific categories
 * <KeyboardShortcutsDisplay categories={['Metatext', 'Chunk Tools']} />
 *
 * // (Optional) Use lower‑level list (e.g., embed inside a settings page section)
 * import { KeyboardShortcutList } from '@components/KeyboardShortcutsDisplay';
 * <KeyboardShortcutList categories={['Navigation']} align="flex-start" />
 *
 * // Render a single item manually (rare – usually let the list handle ordering)
 * import { KeyboardShortcutItem } from '@components/KeyboardShortcutsDisplay';
 * const shortcuts = getShortcutsByCategory()['Metatext'];
 * <KeyboardShortcutItem shortcut={shortcuts[0]} />
 * 
 * Adding Shortcuts
 * ----------------
 * To add a new keyboard shortcut, update the `@utils/keyboardShortcuts` definitions.
 *
 * Props Summary
 * -------------
 * KeyboardShortcutsDisplay
 *  - categories?: string[]  Filter which categories appear in the drawer (defaults to all)
 *
 * KeyboardShortcutList
 *  - categories?: string[]  Filter categories (defaults to all)
 *  - align?: 'center' | 'flex-start'  Vertical stack alignment for items (defaults to 'center')
 *
 * KeyboardShortcutItem
 *  - shortcut: KeyboardShortcut (shape provided by utils)
 *
 * Accessibility Notes
 * -------------------
 *  - IconButton has an aria-label ("Open help").
 *  - Shortcut keys are presented in a <Badge> with a monospace font for legibility.
 *  - Categories use semantic <Text> but could be upgraded to proper headings if needed.
 *
 * Performance Considerations
 * --------------------------
 *  - KeyboardShortcutItem is memoized with React.memo to avoid re-renders when parent lists update.
 *  - The list performs simple mapping; dataset expected to be small—no virtualization required.
 *  - Category filtering is O(nCategories); further optimization unnecessary unless categories grow large.
 *
 * Empty / Edge Cases
 * ------------------
 *  - Categories without shortcuts are skipped silently.
 *  - Passing an unknown category yields no output (harmless).
 *  - If the shortcut map is empty, the drawer will only show the section headers; you may choose to
 *    add a fallback message in that scenario.
 *
 * Extending
 * ---------
 *  - Add new categories/shortcuts: modify `@utils/keyboardShortcuts` definitions.
 *  - Inline (non-drawer) displays can reuse KeyboardShortcutList directly.
 *  - To add search/filter inside the drawer, wrap <KeyboardShortcutList> with stateful controls here.
 *
 * Testing Guidance
 * ----------------
 *  - Render <KeyboardShortcutsDisplay /> and simulate click on the IconButton (query by aria-label).
 *  - Assert drawer content includes category titles & specific shortcut description text.
 *  - Provide a filtered categories prop and ensure unrelated categories are absent.
 *
 * Example Test Snippet (pseudo-code)
 * ---------------------------------
 * render(<KeyboardShortcutsDisplay categories={['Metatext']} />);
 * user.click(screen.getByLabelText('Open help'));
 * expect(screen.getByText('Metatext')).toBeInTheDocument();
 * expect(screen.queryByText('Chunk Tools')).not.toBeInTheDocument();
 *
 * Rationale for Split
 * -------------------
 * Separation improves reuse, isolates formatting logic (Item), category grouping (List), and UX chrome
 * (Display). This structure simplifies future adaptations (e.g., context menu, modal, inline panel) by
 * allowing you to reuse List & Item without duplicating code.
 */
import React, { memo } from 'react';
import { Box, Text, Column, TagRoot as Badge, Button, Heading } from '@styles';
import TooltipButton from '@components/ui/TooltipButton';
import { getShortcutsByCategory, formatShortcut, type KeyboardShortcut } from '@utils/keyboardShortcuts';
import { HiQuestionMarkCircle } from 'react-icons/hi2';
import { SimpleDialog } from '@components/ui/dialog';
// 1. ITEM ------------------------------------------------------------------
export interface KeyboardShortcutItemProps {
    shortcut: KeyboardShortcut;
}

export const KeyboardShortcutItem = memo(function KeyboardShortcutItem({ shortcut }: KeyboardShortcutItemProps) {
    return (
        <Box css={{ display: 'flex', justifyContent: 'flex-end', width: '100%', alignItems: 'center', gap: 8 }}>
            <Text css={{ fontSize: '0.95rem' }}>{shortcut.description}</Text>
            <Badge colorPalette="gray" css={{ fontFamily: 'monospace' }}>
                {formatShortcut(shortcut)}
            </Badge>
        </Box>
    );
});
KeyboardShortcutItem.displayName = 'KeyboardShortcutItem';

// 2. LIST ------------------------------------------------------------------
export interface KeyboardShortcutListProps {
    categories?: string[]; // filter list
    align?: 'center' | 'flex-start'; // alignment variation (drawer vs elsewhere)
}

export function KeyboardShortcutList({ categories, align = 'center' }: KeyboardShortcutListProps) {
    const shortcutsByCategory = getShortcutsByCategory();
    const categoriesToShow = categories || Object.keys(shortcutsByCategory);

    return (
        <>
            {categoriesToShow.map(category => {
                const shortcuts = shortcutsByCategory[category];
                if (!shortcuts?.length) return null;
                return (
                    <Box key={category}>
                        <Text css={{ fontWeight: 600, marginBottom: 8, color: 'inherit' }}>{category}</Text>
                        <Column css={{ flexDirection: 'column', alignItems: align === 'flex-start' ? 'flex-start' : 'center', gap: 4, paddingLeft: 16 }}>
                            {shortcuts.map((s, i) => (
                                <KeyboardShortcutItem key={i} shortcut={s} />
                            ))}
                        </Column>
                    </Box>
                );
            })}
        </>
    );
}

// 3. CONTAINER / DISPLAY ---------------------------------------------------
interface KeyboardShortcutsDisplayProps {
    categories?: string[];
}

/**
 * KeyboardShortcutsDisplay - Displays an IconButton that triggers a list of keyboard shortcuts in a drawer. Categories are from keyboardShortcuts.getShortcutsByCategory().
 *
 * @example
 * <KeyboardShortcutsDisplay categories={['Navigation', 'Interface']} />
 * @param param0 - Props for the component
 * @returns JSX.Element
 */
export function KeyboardShortcutsDisplay({ categories }: KeyboardShortcutsDisplayProps) {

    return (
        <>
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
                <Column css={{ flexDirection: 'column', alignItems: 'flex-start', gap: 16, width: '100%' }}>
                    <Heading css={{ fontWeight: 600 }}>Keyboard Shortcuts</Heading>
                    <Text css={{ fontSize: '0.95rem', color: '$colors$subtle' }}>Use these shortcuts to speed up your workflow.</Text>
                    <KeyboardShortcutList categories={categories} align="flex-start" />
                </Column>
            </SimpleDialog>
        </>
    );
}

export default KeyboardShortcutsDisplay;