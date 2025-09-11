// Header component for Metatext detail page displaying title and review button
import React from 'react';
import { Stack, Heading } from '@styles';
import { KeyboardShortcutsDisplay } from '@components/KeyboardShortcutsDisplay';
import type { ChunkType } from '@mtypes/documents';
import { MetatextHeaderControls, SourceDocInfo, StyleControls } from 'src';
import { SourceDocInfoDisplay } from '@components/SourceDocInfo';
import { ReviewMetatextButton } from './ReviewMetatextButton';

interface MetatextHeaderProps {
    title: string;
    metatextId: number;
    sourceDocumentId?: number;
    displayChunks: ChunkType[];
    setCurrentPage: (page: number) => void;
    showOnlyFavorites: boolean;
    setShowOnlyFavorites: (show: boolean) => void;
}

/**
 * MetatextHeader - Displays the metatext title and review button
 * 
 * A simple presentational component that renders the header section
 * of the metatext detail page with the title, review button, and keyboard shortcuts button.
 */
export function MetatextHeader({
    title,
    metatextId,
    sourceDocumentId,
    displayChunks,
    setCurrentPage,
    showOnlyFavorites,
    setShowOnlyFavorites
}: MetatextHeaderProps) {
    return (
        <Stack
            css={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}
            data-testid="metatext-header"
        >
            <Heading css={{ fontSize: '1.1rem', fontWeight: 600 }}>metatext:</Heading>
            <Heading
                css={{ fontSize: '2rem', color: '#0ea5a4', fontWeight: 700 }}
                data-testid="metatext-title"
            >
                {title}
            </Heading>
            <ReviewMetatextButton />
            {/* <KeyboardShortcutsDisplay categories={['Navigation', 'Interface', 'Chunks']} /> */}
            <KeyboardShortcutsDisplay categories={['Navigation', 'Interface']} />
            <MetatextHeaderControls
                metatextId={metatextId}
                displayChunks={displayChunks}
                setCurrentPage={setCurrentPage}
                showOnlyFavorites={showOnlyFavorites}
                setShowOnlyFavorites={setShowOnlyFavorites}
            />
            <SourceDocInfoDisplay sourceDocumentId={sourceDocumentId} />
            <StyleControls />
        </Stack>
    );
}