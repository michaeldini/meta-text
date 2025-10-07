
// Flashcard component with header, text, and footer. Header toggles visibility of text/footer.
import React, { useState } from 'react';
import { Box, Heading, styled, Text, accordionDown, accordionUp } from '@styles';
import { HiBars3, HiQuestionMarkCircle } from 'react-icons/hi2';
import { Button, SimpleDialog } from '@components/ui';
import * as Collapsible from '@radix-ui/react-collapsible';

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

export interface FlashcardProps {
    word: string;
    definition: string;
    definition_in_context: string;
    context: string;
}

export function Flashcard(props: FlashcardProps) {
    const { word, definition, definition_in_context, context } = props;
    const [open, setOpen] = useState(false);

    return (
        <Box css={{ width: 300 }}>
            <Collapsible.Root open={open} onOpenChange={setOpen}>
                <Collapsible.Trigger asChild>
                    <Heading css={{ cursor: 'pointer' }}>{word}</Heading>
                </Collapsible.Trigger>
                <StyledContent>
                    <Text>{definition}</Text>
                    <Box css={{ borderTop: '1px solid #eee', marginTop: 12 }}>
                        {/* Definition In Context Drawer */}
                        <SimpleDialog
                            title="Definition In Context"
                            tooltip="View the definition of the word in its original context"
                            triggerButton={
                                <Button
                                    onClick={() => { }}
                                    icon={<HiBars3 />}
                                />
                            }
                        >
                            <Box>
                                <Text css={{ fontWeight: 'bold' }}>Word: {word}</Text>
                                <Text css={{ marginTop: 8 }}>{definition_in_context}</Text>
                            </Box>
                        </SimpleDialog>

                        {/* Context Drawer */}
                        <SimpleDialog
                            title="Context"
                            tooltip="View the context around the word"
                            triggerButton={
                                <Button
                                    onClick={() => { }}
                                    icon={<HiQuestionMarkCircle />}
                                />
                            }
                        >
                            <Text>{context}</Text>
                        </SimpleDialog>
                    </Box>
                </StyledContent>
            </Collapsible.Root>
        </Box>
    );
}

export default Flashcard;
