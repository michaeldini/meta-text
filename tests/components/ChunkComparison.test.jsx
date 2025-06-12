import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChunkComparison from '../../src/features/ChunkComparison';
import '@testing-library/jest-dom';

// Mock AiStarsButton to isolate tests
vi.mock('../../src/components/AiStarsButton', () => ({
    __esModule: true,
    default: ({ loading, onClick, label }) => (
        <button onClick={onClick} disabled={loading} aria-label={label} data-testid="ai-stars-btn">
            {loading ? 'Loading...' : label}
        </button>
    ),
}));

// Mock generateChunkNoteSummaryTextComparison
const mockGenerate = vi.fn();
vi.mock('../../src/services/aiService', () => ({
    generateChunkNoteSummaryTextComparison: (...args) => mockGenerate(...args),
}));

describe('ChunkComparison', () => {
    const chunkId = 1;
    const defaultText = 'Comparison result here.';
    let onComparisonUpdate;

    beforeEach(() => {
        onComparisonUpdate = vi.fn();
        mockGenerate.mockReset();
    });

    it('renders initial UI with provided comparisonText', () => {
        render(
            <ChunkComparison chunkId={chunkId} comparisonText={defaultText} onComparisonUpdate={onComparisonUpdate} />
        );
        expect(screen.getByText('What did I miss?')).toBeInTheDocument();
        expect(screen.getByText('Compare Summary/Notes to Text')).toBeInTheDocument();
        expect(screen.getByText(defaultText)).toBeInTheDocument();
    });

    it('shows placeholder if no comparisonText', () => {
        render(
            <ChunkComparison chunkId={chunkId} comparisonText={''} onComparisonUpdate={onComparisonUpdate} />
        );
        expect(screen.getByText('No summary yet.')).toBeInTheDocument();
    });

    it('calls generateChunkNoteSummaryTextComparison and updates onComparisonUpdate', async () => {
        mockGenerate.mockResolvedValueOnce({ result: 'AI comparison result' });
        render(
            <ChunkComparison chunkId={chunkId} comparisonText={''} onComparisonUpdate={onComparisonUpdate} />
        );
        fireEvent.click(screen.getByTestId('ai-stars-btn'));
        expect(mockGenerate).toHaveBeenCalledWith(chunkId);
        await waitFor(() => {
            expect(onComparisonUpdate).toHaveBeenCalledWith('AI comparison result');
        });
    });

    it('shows error if generateChunkNoteSummaryTextComparison throws', async () => {
        mockGenerate.mockRejectedValueOnce(new Error('fail'));
        render(
            <ChunkComparison chunkId={chunkId} comparisonText={''} onComparisonUpdate={onComparisonUpdate} />
        );
        fireEvent.click(screen.getByTestId('ai-stars-btn'));
        await waitFor(() => {
            expect(screen.getByText('Error generating summary')).toBeInTheDocument();
        });
    });

    it('disables button and shows loading state while loading', async () => {
        let resolve;
        mockGenerate.mockImplementation(() => new Promise(r => { resolve = r; }));
        render(
            <ChunkComparison chunkId={chunkId} comparisonText={''} onComparisonUpdate={onComparisonUpdate} />
        );
        fireEvent.click(screen.getByTestId('ai-stars-btn'));
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.getByTestId('ai-stars-btn')).toBeDisabled();
        resolve({ result: 'done' });
        await waitFor(() => {
            expect(screen.getByTestId('ai-stars-btn')).not.toBeDisabled();
        });
    });
});
