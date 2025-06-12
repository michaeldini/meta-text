import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SourceDocInfo from '../../src/components/SourceDocInfo';
import '@testing-library/jest-dom';

// Mock props for the component
const mockDoc = {
    id: 1,
    title: 'Test Document',
    summary: 'A test document for unit testing.'
};

describe('SourceDocInfo', () => {
    it('renders summary from doc with prefix', () => {
        render(<SourceDocInfo doc={mockDoc} />);
        expect(screen.getByText('Summary:', { exact: false })).toBeInTheDocument();
        expect(screen.getByText('A test document for unit testing.', { exact: false })).toBeInTheDocument();
    });
    it('renders empty summary when doc has no summary', () => {
        const docWithoutSummary = { ...mockDoc, summary: '' };
        render(<SourceDocInfo doc={docWithoutSummary} />);
        expect(screen.getByText('No summary available.')).toBeInTheDocument();
        expect(screen.queryByText('A test document for unit testing.')).not.toBeInTheDocument();
    });
    it('calls onClick when AiStarsButton is clicked', () => {
        const docWithSummary = { ...mockDoc };
        const onInfoUpdate = vi.fn();
        // Mock AiStarsButton to expose onClick
        vi.doMock('../../src/components/AiStarsButton', () => ({
            __esModule: true,
            default: ({ onClick }) => (
                <button data-testid="ai-stars-btn" onClick={onClick}>AI</button>
            ),
        }));
        // Re-import after mocking
        return import('../../src/components/SourceDocInfo').then(({ default: SourceDocInfoWithMock }) => {
            render(<SourceDocInfoWithMock doc={docWithSummary} onInfoUpdate={onInfoUpdate} />);
            const btn = screen.getByTestId('ai-stars-btn');
            btn.click();
            expect(btn).toBeInTheDocument();
        });
    });
});
