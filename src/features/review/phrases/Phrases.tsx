// Component to review explanations of phrases with context and explanations
// This component displays a list of explanations, each with its own context and explanation details.
// Extensive use of Material-UI Accordion components for a collapsible view.

// Component to review explanations of phrases with context and explanations
// Migrated from Chakra UI to Stitches and Radix UI
import React from 'react';
import { Explanation } from '@mtypes/review';
import { Box, Text, Heading, styled, accordionDown, accordionUp } from '@styles';
import * as Collapsible from '@radix-ui/react-collapsible';
import { EmptyState } from '@components/ui/empty-state';


// Styled Radix Collapsible.Content that animates height using Stitches keyframes.
const StyledContent = styled(Collapsible.Content, {
    overflow: 'hidden',
    '&[data-state="open"]': {
        animation: `${accordionDown} 300ms ease-out`,
    },
    '&[data-state="closed"]': {
        animation: `${accordionUp} 300ms ease-out`,
    },
});


interface PhrasesProps {
    phrases: Explanation[];
}

interface PhraseItemProps {
    phrase: Explanation;
}

interface PhraseCardProps {
    title: string;
    content: string;
}

export function PhraseCard({ title, content }: PhraseCardProps) {
    return (
        <Box>
            <Heading>{title}</Heading>
            <Text>{content}</Text>
        </Box>
    );
}


export function PhraseItem({ phrase }: PhraseItemProps) {
    return (
        <Collapsible.Root style={{ marginBottom: 12 }} key={phrase.id}>
            <Collapsible.Trigger style={{ cursor: 'pointer' }} asChild>
                <Text css={{ color: '$colors$primary' }}>{phrase.words}</Text>
            </Collapsible.Trigger>
            <StyledContent>
                <PhraseCard
                    title="Explanation"
                    content={phrase.explanation}
                />
                <PhraseCard
                    title="Explanation in Context"
                    content={phrase.explanation_in_context}
                />
            </StyledContent>
        </Collapsible.Root>
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
