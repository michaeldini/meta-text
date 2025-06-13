import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, beforeEach, vi, expect } from 'vitest';

// Mock the service before importing the component
vi.mock('../../src/services/sourceDocumentService', () => ({
    generateSourceDocInfo: vi.fn()
}));
import { generateSourceDocInfo } from '../../src/services/sourceDocumentService';
import SourceDocInfo from '../../src/components/SourceDocInfo';


describe('SourceDocInfo', () => {
    const baseDoc = {
        id: 1,
        title: 'Test Title',
        characters: 'Alice, Bob',
        locations: 'Wonderland, Looking Glass',
        themes: 'Adventure, Identity',
        symbols: 'Rabbit, Mirror',
        summary: 'A summary of the document.',
        text: 'Full document text.'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all doc attributes correctly', () => {
        render(<SourceDocInfo doc={baseDoc} />);
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Characters')).toBeInTheDocument();
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('Locations')).toBeInTheDocument();
        expect(screen.getByText('Wonderland')).toBeInTheDocument();
        expect(screen.getByText('Looking Glass')).toBeInTheDocument();
        expect(screen.getByText('Themes')).toBeInTheDocument();
        expect(screen.getByText('Adventure')).toBeInTheDocument();
        expect(screen.getByText('Identity')).toBeInTheDocument();
        expect(screen.getByText('Symbols')).toBeInTheDocument();
        expect(screen.getByText('Rabbit')).toBeInTheDocument();
        expect(screen.getByText('Mirror')).toBeInTheDocument();
        expect(screen.getByText('Summary')).toBeInTheDocument();
        expect(screen.getByText('A summary of the document.')).toBeInTheDocument();
    });

    it('shows "No Info" if doc.summary is missing', () => {
        const doc = { ...baseDoc, summary: '' };
        render(<SourceDocInfo doc={doc} />);
        expect(screen.getByText('No Info')).toBeInTheDocument();
    });

    it('calls generateSourceDocInfo and onInfoUpdate when Info button is clicked', async () => {
        const onInfoUpdate = vi.fn();
        generateSourceDocInfo.mockResolvedValue();
        render(<SourceDocInfo doc={baseDoc} onInfoUpdate={onInfoUpdate} />);
        const button = screen.getByRole('button', { name: /info/i });
        fireEvent.click(button);
        // Wait for promises to resolve
        await Promise.resolve();
        expect(generateSourceDocInfo).toHaveBeenCalledWith(baseDoc.id, baseDoc.text);
        expect(onInfoUpdate).toHaveBeenCalled();
    });

    it('disables Info button if doc.text is empty', () => {
        render(<SourceDocInfo doc={{ ...baseDoc, text: '' }} />);
        const button = screen.getByRole('button', { name: /info/i });
        expect(button).toBeDisabled();
    });

    it('renders message if no doc is provided', () => {
        render(<SourceDocInfo doc={{}} />);
        expect(screen.getByText('No document data available.')).toBeInTheDocument();
    });
});

