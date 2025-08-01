// Component to review explanations of phrases with context and explanations
// This component displays a list of explanations, each with its own context and explanation details.
// Extensive use of Material-UI Accordion components for a collapsible view.

import React from 'react';
import { Explanation } from '@mtypes/MetatextReview.types';
import { Box, Collapsible, Text, Heading } from "@chakra-ui/react"
import { Alert } from '@components/ui/alert';


interface PhrasesProps {
    phrases: Explanation[];
}

interface PhraseItemProps {
    phrase: Explanation;
}

interface PhraseCardProps {
    title: string;
    content: string;
    elevation?: number;
}

export function PhraseCard({ title, content, elevation = 5 }: PhraseCardProps) {
    return (
        <Box >
            <Heading color="primary">
                {title}
            </Heading>
            <Text>{content}</Text>
        </Box>
    );
}

export function PhraseItem({ phrase }: PhraseItemProps) {
    return (
        <Collapsible.Root p="4" key={phrase.id}>
            <Collapsible.Trigger>
                <Text fontSize="lg" fontWeight="bold">{phrase.words}</Text>
            </Collapsible.Trigger>
            <Collapsible.Content>
                <PhraseCard
                    title="Explanation"
                    content={phrase.explanation}
                    elevation={5}
                />
                <PhraseCard
                    title="Explanation in Context"
                    content={phrase.explanation_in_context}
                    elevation={20}
                />
            </Collapsible.Content>
        </Collapsible.Root>
    );
}

export function Phrases({ phrases }: PhrasesProps) {
    if (!phrases.length)
        return <Alert>No phrases yet. Define some phrases in the metatext editor to see them appear here.</Alert>;

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
