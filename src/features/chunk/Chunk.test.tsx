// Chunk.test.tsx
// Basic tests for the Chunk presentational component using Vitest and React Testing Library.

import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ChunkProps } from './Chunk';
import Chunk from './Chunk';

// Mock dependencies
vi.mock('store', () => ({
    useChunkStore: () => ({
        activeTabs: [],
        updateChunkField: vi.fn(),
    }),
}));
vi.mock('./components/ChunkWords', () => ({
    __esModule: true,
    default: ({ chunk, chunkIdx }: any) => <div data-testid="chunk-words">ChunkWords {chunkIdx}</div>,
}));
vi.mock('../chunk-tools/ChunkToolsContainer', () => ({
    __esModule: true,
    default: ({ chunk }: any) => <div data-testid={`chunk-tools-${chunk.id}`}>Tools {chunk.id}</div>,
}));
vi.mock('./Chunk.styles', () => ({
    getChunkComponentsStyles: () => ({ chunkContainer: {} }),
}));



// Dummy chunk data
const defaultChunk = {
    id: 1,
    text: 'Sample chunk text',
    position: 0,
    note: '',
    summary: '',
    evaluation: '',
    explanation: '',
    metatext_id: 1,
    images: [],
    rewrites: [],
    favorited_by_user_id: null,
};

describe('Chunk', () => {
    it('renders without crashing', () => {
        render(<Chunk chunk={defaultChunk} chunkIdx={1} />);
        expect(screen.getByTestId('chunk-words')).toBeInTheDocument();
        expect(screen.getByTestId(`chunk-tools-${defaultChunk.id}`)).toBeInTheDocument();
    });

    it('passes chunkIdx to ChunkWords', () => {
        render(<Chunk chunk={defaultChunk} chunkIdx={42} />);
        expect(screen.getByText(/ChunkWords 42/)).toBeInTheDocument();
    });

    it('sets data-chunk-id attribute', () => {
        render(<Chunk chunk={defaultChunk} chunkIdx={0} />);
        const box = screen.getByTestId('chunk-words').parentElement;
        expect(box?.getAttribute('data-chunk-id')).toBe('1');
    });
});
