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
        
        // Basic fields should be visible
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Author')).toBeInTheDocument();
        expect(screen.getByText('Test Author')).toBeInTheDocument();
        expect(screen.getByText('Summary')).toBeInTheDocument();
        expect(screen.getByText('A summary.')).toBeInTheDocument();
        
        // Section headers should be visible
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

    it('shows correct expand/collapse icons', async () => {
        render(<SourceDocInfo doc={doc} />);
        
        // Should show ExpandMore icon initially (collapsed state)
        expect(screen.getAllByTestId('ExpandMoreIcon')).toHaveLength(4); // 4 sections
        expect(screen.queryByTestId('ExpandLessIcon')).not.toBeInTheDocument();
        
        // Click to expand Characters section
        fireEvent.click(screen.getByText('Characters'));
        
        await waitFor(() => {
            // Should now have 3 ExpandMore and 1 ExpandLess
            expect(screen.getAllByTestId('ExpandMoreIcon')).toHaveLength(3);
            expect(screen.getAllByTestId('ExpandLessIcon')).toHaveLength(1);
        });
    });

    it('calls generateSourceDocInfo and onInfoUpdate on button click', async () => {
        mockedGenerateSourceDocInfo.mockResolvedValueOnce({});
        const onInfoUpdate = vi.fn();
        render(<SourceDocInfo doc={doc} onInfoUpdate={onInfoUpdate} />);
        const button = screen.getByText(/generate info/i);
        fireEvent.click(button);
        expect(mockedGenerateSourceDocInfo).toHaveBeenCalledWith({ id: doc.id, prompt: doc.text });
        await waitFor(() => expect(onInfoUpdate).toHaveBeenCalled());
    });

    it('shows error if generateSourceDocInfo throws', async () => {
        mockedGenerateSourceDocInfo.mockRejectedValueOnce(new Error('AI error'));
        render(<SourceDocInfo doc={doc} />);
        const button = screen.getByText(/generate info/i);
        fireEvent.click(button);
        expect(await screen.findByText('AI error')).toBeInTheDocument();
    });

    it('disables button and shows loading indicator while loading', async () => {
        let resolvePromise: (value: unknown) => void = () => { };
        mockedGenerateSourceDocInfo.mockImplementation(
            () => new Promise(res => { resolvePromise = res; })
        );
        render(<SourceDocInfo doc={doc} />);
        const button = screen.getByText(/generate info/i);
        fireEvent.click(button);
        expect(button).toBeDisabled();
        // Wait for the promise executor to run and assign resolvePromise
        await waitFor(() => expect(typeof resolvePromise).toBe('function'));
        resolvePromise({});
    });
});
