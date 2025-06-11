import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MetaTextReviewPage from '../../src/pages/MetaTextPage/MetaTextReviewPage';

vi.mock('../../src/services/reviewService', () => {
    const fetchWordlist = vi.fn().mockResolvedValue([{ id: 1, word: 'foo', definition: 'bar', definition_with_context: 'baz' }]);
    const fetchChunkSummariesNotes = vi.fn().mockResolvedValue([{ id: 1, summary: 'summary', notes: 'notes' }]);
    return { fetchWordlist, fetchChunkSummariesNotes };
});
vi.mock('../../src/components/ChunkSummaryNotesTable', () => ({ default: ({ chunks }) => <div data-testid="chunk-summary-notes-table">{chunks.length}</div> }));
vi.mock('../../src/routes', () => ({ metaTextDetailRoute: vi.fn() }));
vi.mock('../../src/utils/logger', () => ({ default: { info: vi.fn(), error: vi.fn() }, info: vi.fn(), error: vi.fn() }));

import * as reviewService from '../../src/services/reviewService';


describe('MetaTextReviewPage', () => {
    beforeEach(() => {
        reviewService.fetchWordlist.mockReset();
        reviewService.fetchChunkSummariesNotes.mockReset();
        reviewService.fetchWordlist.mockResolvedValue([{ id: 1, word: 'foo', definition: 'bar', definition_with_context: 'baz' }]);
        reviewService.fetchChunkSummariesNotes.mockResolvedValue([{ id: 1, summary: 'summary', notes: 'notes' }]);
    });

    function renderWithRoute() {
        return render(
            <MemoryRouter initialEntries={["/metatext/123/review"]}>
                <Routes>
                    <Route path="/metatext/:id/review" element={<MetaTextReviewPage />} />
                </Routes>
            </MemoryRouter>
        );
    }

    it('renders wordlist and chunk summary notes', async () => {
        renderWithRoute();
        // Wait for loading indicator to disappear
        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });
        // Now check for loaded content
        expect(screen.getByText('Wordlist')).toBeInTheDocument();
        expect(screen.getByText('foo')).toBeInTheDocument();
        expect(screen.getByText('bar')).toBeInTheDocument();
        expect(screen.getByText('baz')).toBeInTheDocument();
        expect(screen.getByTestId('chunk-summary-notes-table')).toBeInTheDocument();
    });

    it('shows loading indicator', () => {
        reviewService.fetchWordlist.mockImplementation(() => new Promise(() => { }));
        renderWithRoute();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows error message', async () => {
        reviewService.fetchWordlist.mockRejectedValueOnce(new Error('fail'));
        renderWithRoute();
        await waitFor(() => {
            expect(
                screen.getByText((content) =>
                    /failed to load wordlist/i.test(content)
                )
            ).toBeInTheDocument();
        });
    });

    it('shows empty wordlist message', async () => {
        reviewService.fetchWordlist.mockResolvedValueOnce([]);
        renderWithRoute();
        await waitFor(() => {
            expect(screen.getByText(/no words found/i)).toBeInTheDocument();
        });
    });
});
