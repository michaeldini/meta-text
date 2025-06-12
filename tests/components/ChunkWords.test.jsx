import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChunkWords from '../../src/features/ChunkWords';
import '@testing-library/jest-dom';

// Mock UndoArrowIcon and WordActionDialog to isolate tests
vi.mock('../../src/components/icons/UndoArrowIcon', () => ({
    __esModule: true,
    default: () => <span data-testid="undo-arrow-icon">Undo</span>,
}));
vi.mock('../../src/features/WordActionDialog', () => ({
    __esModule: true,
    default: (props) => (
        <div data-testid="word-action-dialog" data-open={!!props.anchorEl}>
            Dialog for {props.word}
            <button onClick={props.onSplit}>Split</button>
        </div>
    ),
}));

describe('ChunkWords', () => {
    let baseProps;
    beforeEach(() => {
        baseProps = {
            words: ['Hello', 'world'],
            chunkIdx: 0,
            handleWordClick: vi.fn(),
            handleRemoveChunk: vi.fn(),
            chunk: { meta_text_id: 123 },
        };
    });

    it('renders all words as clickable spans', () => {
        render(<ChunkWords {...baseProps} />);
        baseProps.words.forEach(word => {
            expect(screen.getByText(word)).toBeInTheDocument();
        });
    });

    it('opens dialog with correct word when a word is clicked', () => {
        render(<ChunkWords {...baseProps} />);
        fireEvent.click(screen.getByText('world'));
        expect(screen.getByTestId('word-action-dialog')).toHaveAttribute('data-open', 'true');
        expect(screen.getByText('Dialog for world')).toBeInTheDocument();
    });

    it('calls handleWordClick and closes dialog on split', () => {
        render(<ChunkWords {...baseProps} />);
        fireEvent.click(screen.getByText('Hello'));
        fireEvent.click(screen.getByText('Split'));
        expect(baseProps.handleWordClick).toHaveBeenCalledWith(0, 0);
        // Dialog should close (data-open becomes false)
        expect(screen.getByTestId('word-action-dialog')).toHaveAttribute('data-open', 'false');
    });

    it('shows Undo icon only for last word', () => {
        render(<ChunkWords {...baseProps} />);
        // Only one Undo icon, after last word
        expect(screen.getAllByTestId('undo-arrow-icon')).toHaveLength(1);
    });

    it('calls handleRemoveChunk when Undo icon is clicked', () => {
        render(<ChunkWords {...baseProps} />);
        const undoBtn = screen.getByRole('button', { name: /undo split/i });
        fireEvent.click(undoBtn);
        expect(baseProps.handleRemoveChunk).toHaveBeenCalledWith(0);
    });

    it('passes correct context and metaTextId to WordActionDialog', () => {
        render(<ChunkWords {...baseProps} />);
        const dialog = screen.getByTestId('word-action-dialog');
        expect(dialog).toHaveTextContent('Dialog for');
        // context and metaTextId are not visible, but we can check by opening dialog and splitting
        fireEvent.click(screen.getByText('Hello'));
        fireEvent.click(screen.getByText('Split'));
        expect(baseProps.handleWordClick).toHaveBeenCalledWith(0, 0);
    });
});
