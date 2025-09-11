// Front of a flashcard component that displays a word and allows flipping to see its definition

import React from 'react';
import { styled } from '@styles';


const CardBody = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    width: '100%',
    padding: 0,
});

const FlashcardButton = styled('button', {
    width: '100%',
    height: 'auto',
    fontSize: '2rem',
    fontWeight: 'bold',
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    padding: '18px 0',
    transition: 'background 0.2s',
    '&:hover': { background: '$colors$buttonPrimaryBg' },
});

const WordText = styled('div', {
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
});

export function FlashcardFront(props: { word: string; setFlipped: (flipped: boolean) => void }) {
    const { word, setFlipped } = props;
    return (
        <FlashcardButton onClick={() => setFlipped(true)}>
            <CardBody>
                <WordText>{word}</WordText>
            </CardBody>
        </FlashcardButton>
    );
}

export default FlashcardFront;
