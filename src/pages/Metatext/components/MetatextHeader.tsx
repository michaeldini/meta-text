// Header component for Metatext detail page displaying title and review button
import React from 'react';
import { Stack, Heading } from '@styles';
import { KeyboardShortcutsDisplay } from '@components/KeyboardShortcutsDisplay';
import { MetatextHeaderControls, SourceDocInfo, StyleControls } from 'src';
import { SourceDocInfoDisplay } from '@components/SourceDocInfo';
import { ReviewMetatextButton } from './ReviewMetatextButton';

interface MetatextHeaderProps {
    title: string;
    metatextId: number;
    sourceDocumentId?: number;
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
}: MetatextHeaderProps) {
    return (
        <Stack
            css={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}
            data-testid="metatext-header"
        >
            <Heading>metatext: {title}</Heading>
            <ReviewMetatextButton />
            {/* <KeyboardShortcutsDisplay categories={['Navigation', 'Interface', 'Chunks']} /> */}
            <KeyboardShortcutsDisplay categories={['Navigation', 'Interface']} />
            <MetatextHeaderControls
                metatextId={metatextId}
            />
            <SourceDocInfoDisplay sourceDocumentId={sourceDocumentId} />
            <StyleControls />
        </Stack>
    );
}