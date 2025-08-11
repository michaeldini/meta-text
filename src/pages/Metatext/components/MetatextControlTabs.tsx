import React from 'react';
import { Tabs } from '@chakra-ui/react/tabs';
import { SourceDocInfo } from '@components/SourceDocInfo';
import { StyleControls } from '@components/stylecontrols';
import { MetatextHeaderControls } from '@components/MetatextHeaderControls';
import type { ChunkType } from '@mtypes/documents';

interface MetatextControlTabsProps {
    metatextId: number;
    sourceDocumentId?: number;
    displayChunks: ChunkType[];
    setCurrentPage: (page: number) => void;
    showOnlyFavorites: boolean;
    setShowOnlyFavorites: (show: boolean) => void;
}

/**
 * MetatextControlTabs - Renders tabs for Info, Controls, and Styles
 */
export const MetatextControlTabs: React.FC<MetatextControlTabsProps> = ({
    metatextId,
    sourceDocumentId,
    displayChunks,
    setCurrentPage,
    showOnlyFavorites,
    setShowOnlyFavorites,
}) => {
    return (
        <Tabs.Root w="100%" deselectable fitted defaultValue={"Controls"}>
            <Tabs.List colorPalette="blue">
                <Tabs.Trigger value="info">Info</Tabs.Trigger>
                <Tabs.Trigger value="controls">Controls</Tabs.Trigger>
                <Tabs.Trigger value="styles">Styles</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="info">
                <SourceDocInfo sourceDocumentId={sourceDocumentId} />
            </Tabs.Content>
            <Tabs.Content value="controls">
                <MetatextHeaderControls
                    metatextId={metatextId}
                    displayChunks={displayChunks}
                    setCurrentPage={setCurrentPage}
                    showOnlyFavorites={showOnlyFavorites}
                    setShowOnlyFavorites={setShowOnlyFavorites}
                />
            </Tabs.Content>
            <Tabs.Content value="styles">
                <StyleControls />
            </Tabs.Content>
        </Tabs.Root>
    );
};
