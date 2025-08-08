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
        <Tabs.Root variant="plain" w="100%" deselectable fitted defaultValue={"Controls"}>
            <Tabs.List bg="bg.inverted">
                <Tabs.Trigger value="tab-1">Info</Tabs.Trigger>
                <Tabs.Trigger value="tab-2">Controls</Tabs.Trigger>
                <Tabs.Trigger value="tab-3">Styles</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="tab-1">
                <SourceDocInfo sourceDocumentId={sourceDocumentId} />
            </Tabs.Content>
            <Tabs.Content value="tab-2">
                <MetatextHeaderControls
                    metatextId={metatextId}
                    displayChunks={displayChunks}
                    setCurrentPage={setCurrentPage}
                    showOnlyFavorites={showOnlyFavorites}
                    setShowOnlyFavorites={setShowOnlyFavorites}
                />
            </Tabs.Content>
            <Tabs.Content value="tab-3">
                <StyleControls />
            </Tabs.Content>
        </Tabs.Root>
    );
};
