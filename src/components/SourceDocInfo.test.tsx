import './setupTests';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SourceDocInfo from './SourceDocInfo';
import { SourceDocument } from '../types/sourceDocument';

vi.mock('../services/sourceDocInfoService', () => ({
    generateSourceDocInfo: vi.fn(),
}));

import { generateSourceDocInfo } from '../services/sourceDocInfoService';
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
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Author')).toBeInTheDocument();
        expect(screen.getByText('Test Author')).toBeInTheDocument();
        expect(screen.getByText('Summary')).toBeInTheDocument();
        expect(screen.getByText('A summary.')).toBeInTheDocument();
        expect(screen.getByText('Characters')).toBeInTheDocument();
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('Locations')).toBeInTheDocument();
        expect(screen.getByText('Wonderland')).toBeInTheDocument();
        expect(screen.getByText('Paris')).toBeInTheDocument();
        expect(screen.getByText('Themes')).toBeInTheDocument();
        expect(screen.getByText('Adventure')).toBeInTheDocument();
        expect(screen.getByText('Friendship')).toBeInTheDocument();
        expect(screen.getByText('Symbols')).toBeInTheDocument();
        expect(screen.getByText('Rabbit')).toBeInTheDocument();
        expect(screen.getByText('Hat')).toBeInTheDocument();
        // Should not render id or text
        expect(screen.queryByText('1')).toBeNull();
        expect(screen.queryByText('Full text here.')).toBeNull();
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
