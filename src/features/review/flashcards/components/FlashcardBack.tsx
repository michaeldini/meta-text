import { HiBars3, HiQuestionMarkCircle } from 'react-icons/hi2';
// Back of a flashcard component that displays the definition and context of a word


import React from 'react';
import { styled } from '@styles';
import { SimpleDrawer } from '@components/ui';

export interface FlashcardBackProps {
    word: string;
    definition: string;
    definition_in_context: string;
    context: string;
    setFlipped: (flipped: boolean) => void;
}

const CardBody = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: '16px',
});
const CardTitle = styled('div', {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: 4,
});
const CardDescription = styled('div', {
    fontSize: '1rem',
    marginBottom: 8,
});
const CardFooter = styled('div', {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    padding: '12px 16px',
    borderTop: '1px solid #eee',
});
const FlashcardButton = styled('button', {
    width: '100%',
    height: 'auto',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    padding: '12px 0',
    marginBottom: 8,
    transition: 'background 0.2s',
    '&:hover': { background: '$colors$buttonPrimaryBg' },
});
const IconButton = styled('button', {
    background: 'transparent',
    border: 'none',
    borderRadius: 6,
    padding: 6,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '1.2rem',
    transition: 'background 0.2s',
    '&:hover': { background: '#f0f0f0' },
});
const Highlight = styled('span', {
    background: '#0ea5a4',
    color: 'white',
    padding: '2px 6px',
    borderRadius: 4,
});
const Box = styled('div', {});
const Text = styled('div', {
    fontSize: '1rem',
    color: 'inherit',
    marginBottom: 4,
});

export function FlashcardBack(props: FlashcardBackProps) {
    const {
        word,
        definition,
        definition_in_context,
        context,
        setFlipped
    } = props;

    return (
        <>
            <CardBody>
                <FlashcardButton onClick={() => setFlipped(false)}>
                    <CardTitle>{word}</CardTitle>
                </FlashcardButton>
                <CardDescription>{definition}</CardDescription>
            </CardBody>

            <CardFooter>
                {/* Definition In Context */}
                <SimpleDrawer
                    triggerButton={
                        <IconButton aria-label={`open-definition-${word}`} title="Definition In Context">
                            <HiBars3 />
                        </IconButton>
                    }
                    title="Definition In Context"
                >
                    <Box css={{ padding: 16 }}>
                        <Text css={{ fontWeight: 'bold' }}>Word: {word}</Text>
                        <Text css={{ marginTop: 8 }}>{definition_in_context}</Text>
                    </Box>
                </SimpleDrawer>

                {/* Context */}
                <SimpleDrawer
                    triggerButton={
                        <IconButton aria-label={`open-context-${word}`} title="Context">
                            <HiQuestionMarkCircle />
                        </IconButton>
                    }
                    title="Context"
                >
                    <Highlight>{context}</Highlight>
                </SimpleDrawer>
            </CardFooter>
        </>
    );
}

export default FlashcardBack;
