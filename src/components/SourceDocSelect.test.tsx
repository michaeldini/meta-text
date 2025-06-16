import './setupTests';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SourceDocSelect, { SourceDoc } from './SourceDocSelect';

const sourceDocs: SourceDoc[] = [
    { id: '1', title: 'Document One' },
    { id: '2', title: 'Document Two' },
];

describe('SourceDocSelect', () => {
    it('renders label and all options', () => {
        render(
            <SourceDocSelect value="" onChange={vi.fn()} sourceDocs={sourceDocs} label="Select Doc" />
        );
        expect(screen.getByLabelText('Select Doc')).toBeInTheDocument();
        fireEvent.mouseDown(screen.getByLabelText('Select Doc'));
        expect(screen.getByText('Document One')).toBeInTheDocument();
        expect(screen.getByText('Document Two')).toBeInTheDocument();
    });

    it('shows loading state', () => {
        render(
            <SourceDocSelect value="" onChange={vi.fn()} sourceDocs={[]} loading />
        );
        // Check for the loading indicator outside the select
        expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows error state', () => {
        render(
            <SourceDocSelect value="" onChange={vi.fn()} sourceDocs={[]} error="Failed to load" />
        );
        expect(screen.getByText('Failed to load')).toBeInTheDocument();
    });

    it('shows no documents found when list is empty', () => {
        render(
            <SourceDocSelect value="" onChange={vi.fn()} sourceDocs={[]} />
        );
        fireEvent.mouseDown(screen.getByLabelText('Source Document'));
        expect(screen.getByText('No documents found')).toBeInTheDocument();
    });

    it('calls onChange when an option is selected', () => {
        const handleChange = vi.fn();
        render(
            <SourceDocSelect value="" onChange={handleChange} sourceDocs={sourceDocs} />
        );
        fireEvent.mouseDown(screen.getByLabelText('Source Document'));
        fireEvent.click(screen.getByText('Document Two'));
        expect(handleChange).toHaveBeenCalled();
    });
});
