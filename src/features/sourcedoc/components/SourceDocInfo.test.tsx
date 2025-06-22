import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SourceDocInfo from './SourceDocInfo';
import { SourceDocument } from '../../../types/sourceDocument';
import { generateSourceDocInfo } from '../../../services/sourceDocInfoService';

vi.mock('../../../services/sourceDocInfoService', () => ({
    generateSourceDocInfo: vi.fn(),
}));

const mockedGenerateSourceDocInfo = generateSourceDocInfo as unknown as ReturnType<typeof vi.fn>;

describe('SourceDocInfo', () => {
    const doc: SourceDocument = {
        id: 1, // fixed: number instead of string
        title: 'Test Title',
        author: 'Test Author',
        summary: 'A summary.',
        characters: 'Alice, Bob',
        locations: 'Wonderland, Paris',
        themes: 'Adventure, Friendship',
        symbols: 'Rabbit, Hat',
        text: 'Full text here.'
    };

    it('renders all fields except id and text', () => {
        render(<SourceDocInfo doc={doc} />);

        // section titles should be in the document
        expect(screen.getByText('Author')).toBeInTheDocument();
        expect(screen.getByText('Summary')).toBeInTheDocument();
        expect(screen.getByText('Characters')).toBeInTheDocument();
        expect(screen.getByText('Locations')).toBeInTheDocument();
        expect(screen.getByText('Themes')).toBeInTheDocument();
        expect(screen.getByText('Symbols')).toBeInTheDocument();

        // Individual items should be hidden initially (in collapsed state)
        expect(screen.queryByText('Alice')).not.toBeInTheDocument();
        expect(screen.queryByText('Bob')).not.toBeInTheDocument();
        expect(screen.queryByText('Wonderland')).not.toBeInTheDocument();
        expect(screen.queryByText('Paris')).not.toBeInTheDocument();
        expect(screen.queryByText('Adventure')).not.toBeInTheDocument();
        expect(screen.queryByText('Friendship')).not.toBeInTheDocument();
        expect(screen.queryByText('Rabbit')).not.toBeInTheDocument();
        expect(screen.queryByText('Hat')).not.toBeInTheDocument();
        expect(screen.queryByText('Test Author')).not.toBeInTheDocument();
        expect(screen.queryByText('A summary.')).not.toBeInTheDocument();
        expect(screen.queryByText('Test Title')).not.toBeInTheDocument();

        // Should not render id or text
        expect(screen.queryByText('1')).not.toBeInTheDocument();
        expect(screen.queryByText('Full text here.')).not.toBeInTheDocument();
    });

    it('expands and collapses sections when clicked', async () => {
        render(<SourceDocInfo doc={doc} />);

        // Initially, Characters section should be collapsed
        expect(screen.queryByText('Alice')).not.toBeInTheDocument();
        expect(screen.queryByText('Bob')).not.toBeInTheDocument();

        // Click on Characters section to expand it
        const charactersSection = screen.getByText('Characters');
        fireEvent.click(charactersSection);

        // Now the characters should be visible
        await waitFor(() => {
            expect(screen.getByText('Alice')).toBeInTheDocument();
            expect(screen.getByText('Bob')).toBeInTheDocument();
        });

        // Click again to collapse
        fireEvent.click(charactersSection);

        // Characters should be hidden again
        await waitFor(() => {
            expect(screen.queryByText('Alice')).not.toBeInTheDocument();
            expect(screen.queryByText('Bob')).not.toBeInTheDocument();
        });
    });

    it('can expand multiple sections independently', async () => {
        render(<SourceDocInfo doc={doc} />);

        // Expand Characters section
        fireEvent.click(screen.getByText('Characters'));
        await waitFor(() => {
            expect(screen.getByText('Alice')).toBeInTheDocument();
        });

        // Expand Locations section
        fireEvent.click(screen.getByText('Locations'));
        await waitFor(() => {
            expect(screen.getByText('Wonderland')).toBeInTheDocument();
            expect(screen.getByText('Paris')).toBeInTheDocument();
        });

        // Both sections should remain expanded
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Wonderland')).toBeInTheDocument();
    });

    it('does not render sections with no data', () => {
        const docWithMissingFields: SourceDocument = {
            id: 2,
            title: 'Test Title',
            author: 'Test Author',
            summary: 'A summary.',
            characters: '', // empty
            locations: 'Paris', // has data
            themes: null, // null
            symbols: undefined, // undefined
            text: 'Full text here.'
        };

        render(<SourceDocInfo doc={docWithMissingFields} />);

        // Should not show empty sections
        expect(screen.queryByText('Characters')).not.toBeInTheDocument();
        expect(screen.queryByText('Themes')).not.toBeInTheDocument();
        expect(screen.queryByText('Symbols')).not.toBeInTheDocument();

        // Should show section with data
        expect(screen.getByText('Locations')).toBeInTheDocument();
    });

});
