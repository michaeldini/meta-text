// Component to review explanations of phrases with context and explanations
// This component displays a list of explanations, each with its own context and explanation details.
// Extensive use of Material-UI Accordion components for a collapsible view.

// Component to review explanations of phrases with context and explanations
// Migrated from Chakra UI to Stitches and Radix UI
import React from 'react';
import { Explanation } from '@mtypes/MetatextReview.types';
import { Box, Text, Heading } from '@styles';
import { styled } from '@styles';
import * as Collapsible from '@radix-ui/react-collapsible';
import { EmptyState } from '@components/ui/empty-state';


interface PhrasesProps {
    phrases: Explanation[];
}

interface PhraseItemProps {
    phrase: Explanation;
}


// Card container for phrase explanations
const PhraseCardContainer = styled(Box, {
    padding: '8px 0',
});

interface PhraseCardProps {
    title: string;
    content: string;
}

export function PhraseCard({ title, content }: PhraseCardProps) {
    return (
        <PhraseCardContainer>
            <Heading css={{ color: '$colors$buttonPrimaryBg', marginBottom: 4 }}>{title}</Heading>
            <Text>{content}</Text>
        </PhraseCardContainer>
    );
}

// Collapsible phrase item using Radix UI and Stitches
const PhraseCollapsibleRoot = styled(Collapsible.Root, {
    borderRadius: 8,
    border: '1px solid $colors$border',
    marginBottom: 12,
    background: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    padding: 12,
});

const PhraseCollapsibleTrigger = styled(Collapsible.Trigger, {
    all: 'unset',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '1rem',
    color: '$colors$buttonPrimaryBg',
    marginBottom: 6,
    display: 'block',
});

const PhraseCollapsibleContent = styled(Collapsible.Content, {
    paddingLeft: 4,
});

export function PhraseItem({ phrase }: PhraseItemProps) {
    return (
        <PhraseCollapsibleRoot key={phrase.id}>
            <PhraseCollapsibleTrigger>
                <Text css={{ fontSize: '1rem', fontWeight: 700 }}>{phrase.words}</Text>
            </PhraseCollapsibleTrigger>
            <PhraseCollapsibleContent>
                <PhraseCard
                    title="Explanation"
                    content={phrase.explanation}
                />
                <PhraseCard
                    title="Explanation in Context"
                    content={phrase.explanation_in_context}
                />
            </PhraseCollapsibleContent>
        </PhraseCollapsibleRoot>
    );
}

export function Phrases({ phrases }: PhrasesProps) {
    if (!phrases.length)
        return <EmptyState title="No Explanations Yet" icon="😕" description="Create a new explanation to see it here." />;

    return (
        <Box>
            {phrases.map((phrase) => (
                <PhraseItem
                    key={phrase.id}
                    phrase={phrase}
                />
            ))}
        </Box>
    );
}

export default Phrases;
