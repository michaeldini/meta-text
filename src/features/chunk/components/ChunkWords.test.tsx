// Tests for ChunkWords component
// This file tests basic rendering and interaction for the ChunkWords component.

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useUIPreferencesStore } from '../../../store';
import { useWordSelection } from '../hooks/useWordSelection';
import ChunkWords, { ChunkWordsProps } from './ChunkWords';

// Mock Zustand store
vi.mock('../../../store', async () => {
    const actual = await vi.importActual<any>("../../../store");
    return {
        ...actual,
        useUIPreferencesStore: vi.fn()
    };
});

// Mock useWordSelection hook
vi.mock('../hooks/useWordSelection', () => ({
    useWordSelection: vi.fn()
}));

// Mock MergeChunksTool and WordsToolbar
vi.mock('features/chunk-merge', () => ({
    MergeChunksTool: () => <div data-testid="merge-chunks-tool" />
}));
vi.mock('../components/WordsToolbar', () => ({
    __esModule: true,
    default: () => <div data-testid="words-toolbar" />
}));

const mockUIPreferences = {
    textSizePx: 16,
    fontFamily: 'Arial',
    lineHeight: 1.5,
    paddingX: 0.25,
    showChunkPositions: true,
};

const mockWordSelection = {
    dialogAnchor: null,
    selectedWordIdx: 0,
    highlightedIndices: [],
    handleWordDown: vi.fn(),
    handleWordEnter: vi.fn(),
    handleWordUp: vi.fn(),
    handleToolbarClose: vi.fn(),
    handleTouchMove: vi.fn(),
};

describe('ChunkWords', () => {
    beforeEach(() => {
        (useUIPreferencesStore as any).mockImplementation(cb => cb(mockUIPreferences));
        (useWordSelection as any).mockReturnValue(mockWordSelection);
    });

    const chunk = {
        text: 'Hello world test',
        position: 3,
        // ...other ChunkType fields if needed
    } as any;

    const defaultProps: ChunkWordsProps = {
        chunk,
        chunkIdx: 1,
    };

    function renderWithTheme(props = defaultProps) {
        const theme = createTheme();
        return render(
            <ThemeProvider theme={theme}>
                <ChunkWords {...props} />
            </ThemeProvider>
        );
    }

    it('renders all words in the chunk', () => {
        renderWithTheme();
        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.getByText('world')).toBeInTheDocument();
        expect(screen.getByText('test')).toBeInTheDocument();
    });

    it('shows chunk position if enabled', () => {
        renderWithTheme();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders MergeChunksTool and WordsToolbar', () => {
        renderWithTheme();
        // Check for the merge button by aria-label instead of test id
        expect(screen.getByRole('button', { name: /undo split/i })).toBeInTheDocument();
        expect(screen.getByTestId('words-toolbar')).toBeInTheDocument();
    });

    it('calls handleWordDown on mouse down', () => {
        renderWithTheme();
        const word = screen.getByText('Hello');
        fireEvent.mouseDown(word);
        expect(mockWordSelection.handleWordDown).toHaveBeenCalled();
    });

    it('calls handleWordEnter on mouse enter', () => {
        renderWithTheme();
        const word = screen.getByText('Hello');
        fireEvent.mouseEnter(word);
        expect(mockWordSelection.handleWordEnter).toHaveBeenCalled();
    });
});
