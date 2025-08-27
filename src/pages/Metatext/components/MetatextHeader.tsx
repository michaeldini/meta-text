import { HiAcademicCap } from 'react-icons/hi2';
// Header component for Metatext detail page displaying title and review button
import React from 'react';
import { Stack } from '@chakra-ui/react/stack';
import { Heading } from '@chakra-ui/react/heading';
import { TooltipButton } from '@components/TooltipButton';
import { KeyboardShortcutsDisplay } from '@components/KeyboardShortcutsDisplay';
interface MetatextHeaderProps {
    title: string;
    onReviewClick: () => void;
}

/**
 * MetatextHeader - Displays the metatext title and review button
 * 
 * A simple presentational component that renders the header section
 * of the metatext detail page with the title, review button, and keyboard shortcuts button.
 */
export function MetatextHeader({
    title,
    onReviewClick
}: MetatextHeaderProps) {
    return (
        <Stack
            direction="row"
            alignItems="center"
            data-testid="metatext-header"
        >
            <Heading size="md">metatext:</Heading>
            <Heading
                size="3xl"
                color="fg.info"
                data-testid="metatext-title"
            >
                {title}
            </Heading>
            <TooltipButton
                label="Review"
                tooltip="Review this metatext"
                icon={<HiAcademicCap />}
                onClick={onReviewClick}
                data-testid="review-button"
            />
            {/* <KeyboardShortcutsDisplay categories={['Navigation', 'Interface', 'Chunks']} /> */}
            <KeyboardShortcutsDisplay categories={['Navigation', 'Interface']} />
        </Stack>
    );
}