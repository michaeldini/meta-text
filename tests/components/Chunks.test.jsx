import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import Chunks from '../../src/features/Chunks';
import '@testing-library/jest-dom';

// Mock scrollIntoView for all elements (jsdom doesn't implement it)
beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

// Mock Chunk component to isolate Chunks tests
vi.mock('../../src/features/Chunk', () => ({
    default: (props) => (
        <div data-testid="chunk-mock">Chunk {props.chunkIdx}</div>
    ),
}));

describe('Chunks component', () => {
    let baseProps;
    beforeEach(() => {
        baseProps = {
            chunks: Array.from({ length: 12 }, (_, i) => ({ id: i, text: `Chunk ${i}` })),
            handleWordClick: vi.fn(),
            handleRemoveChunk: vi.fn(),
            handleChunkFieldChange: vi.fn(),
        };
    });

    it('renders correct number of chunks per page', () => {
        render(<Chunks {...baseProps} />);
        // Should render 5 chunks on the first page
        expect(screen.getAllByTestId('chunk-mock')).toHaveLength(5);
    });

    it('renders pagination controls when needed', () => {
        render(<Chunks {...baseProps} />);
        // Pagination should be present (top and bottom)
        expect(screen.getAllByRole('navigation')).toHaveLength(2);
    });
    it('handles page changes correctly', () => {
        render(<Chunks {...baseProps} />);
        // Initial page should be 1
        expect(screen.getByText('Chunk 0')).toBeInTheDocument();

        // Go to page 2
        // Click "Go to page 2" button (only once)
        fireEvent.click(screen.getAllByRole('button', { name: 'Go to page 2' })[0]);

        // Now, Chunk 5 should be visible, Chunk 0 should not
        expect(screen.getByText('Chunk 5')).toBeInTheDocument();
        expect(screen.queryByText('Chunk 0')).toBeNull();
        // Should render 5 chunks on the second page
        expect(screen.getAllByTestId('chunk-mock')).toHaveLength(5);
    });
    it('scrolls to top of container on page change', () => {
        render(<Chunks {...baseProps} />);
        const containerElement = screen.queryByTestId('chunks-container');

        // Simulate page change
        // There are two pagination controls (top and bottom), simulate clicking the second page on both
        const paginationButtons = screen.getAllByRole('button', { name: 'Go to page 2' });
        // Click both to ensure both paginations trigger the scroll
        paginationButtons.forEach(btn => fireEvent.click(btn));

        // Check if scrollIntoView was called, but only if the container exists
        if (containerElement && containerElement.scrollIntoView) {
            expect(containerElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
        } else {
            // Fail the test if the container is missing
            throw new Error('chunks-container not found in the DOM');
        }
    });
    it('handles empty chunks array gracefully', () => {
        render(<Chunks {...baseProps} chunks={[]} />);
        // Should not crash and render no chunks
        expect(screen.queryAllByTestId('chunk-mock')).toHaveLength(0);
        // Pagination should not be rendered
        expect(screen.queryByRole('navigation')).toBeNull();
    });
});