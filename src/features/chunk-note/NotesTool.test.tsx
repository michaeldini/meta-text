/**
 * Basic presentation tests for NotesTool
 * - Checks rendering and visibility of summary and notes fields
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock ChunkTextField to just render a div with a test id
vi.mock('features', () => ({
    __esModule: true,
    ChunkTextField: (props) => <div data-testid={props['aria-label']} />,
    getSharedToolStyles: () => ({ toolTabContainer: {} }),
}));

import NotesTool from './NotesTool';

const mockChunk = {
    id: 'chunk-1',
    summary: 'Initial summary',
    note: 'Initial note',
};

describe('NotesTool (presentation)', () => {
    it('renders summary and notes fields when visible', () => {
        render(
            <NotesTool
                chunk={mockChunk}
                updateChunkField={vi.fn()}
                isVisible={true}
            />
        );
        expect(screen.getByTestId('Summary input field')).toBeInTheDocument();
        expect(screen.getByTestId('Notes input field')).toBeInTheDocument();
    });

    it('does not render fields when isVisible is false', () => {
        render(
            <NotesTool
                chunk={mockChunk}
                updateChunkField={vi.fn()}
                isVisible={false}
            />
        );
        expect(screen.queryByTestId('Summary input field')).toBeNull();
        expect(screen.queryByTestId('Notes input field')).toBeNull();
    });
});
