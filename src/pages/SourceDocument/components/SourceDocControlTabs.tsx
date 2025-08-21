/**
 * Tabs used on the Source Document detail page.
 * Extracted from `SourceDocDetailPage` to keep the page component concise.
 */
import React from 'react';
import { Tabs } from '@chakra-ui/react/tabs';
import { SourceDocInfo } from '@components/SourceDocInfo';
import { StyleControls } from '@components/stylecontrols';

interface SourceDocControlTabsProps {
    sourceDocumentId?: number;
    /** Pass through to StyleControls to hide horizontal padding when desired */
    showPaddingX?: boolean;
}

export function SourceDocControlTabs({ sourceDocumentId, showPaddingX = true }: SourceDocControlTabsProps) {
    return (
        <Tabs.Root w="100%" deselectable fitted defaultValue={"Controls"}>
            <Tabs.List colorPalette="blue">
                <Tabs.Trigger value="info">Info</Tabs.Trigger>
                <Tabs.Trigger value="styles">Styles</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="info">
                <SourceDocInfo sourceDocumentId={sourceDocumentId} />
            </Tabs.Content>
            <Tabs.Content value="styles">
                <StyleControls showPaddingX={showPaddingX} />
            </Tabs.Content>
        </Tabs.Root>
    );
}

export default SourceDocControlTabs;
