import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DocTypeSelect, { type DocType } from './DocTypeSelect';

describe('DocTypeSelect', () => {
    const mockOnChange = vi.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    it('should render with sourceDoc selected by default', () => {
        render(<DocTypeSelect value="sourceDoc" onChange={mockOnChange} />);

        const sourceDocButton = screen.getByRole('button', { name: 'Source Document' });
        const metaTextButton = screen.getByRole('button', { name: 'Meta-Text' });

        expect(sourceDocButton).toBeInTheDocument();
        expect(metaTextButton).toBeInTheDocument();
        expect(sourceDocButton).toHaveAttribute('aria-pressed', 'true');
        expect(metaTextButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should render with metaText selected', () => {
        render(<DocTypeSelect value="metaText" onChange={mockOnChange} />);

        const sourceDocButton = screen.getByRole('button', { name: 'Source Document' });
        const metaTextButton = screen.getByRole('button', { name: 'Meta-Text' });

        expect(sourceDocButton).toHaveAttribute('aria-pressed', 'false');
        expect(metaTextButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should call onChange when sourceDoc button is clicked', () => {
        render(<DocTypeSelect value="metaText" onChange={mockOnChange} />);

        const sourceDocButton = screen.getByRole('button', { name: 'Source Document' });
        fireEvent.click(sourceDocButton);

        expect(mockOnChange).toHaveBeenCalledWith('sourceDoc');
    });

    it('should call onChange when metaText button is clicked', () => {
        render(<DocTypeSelect value="sourceDoc" onChange={mockOnChange} />);

        const metaTextButton = screen.getByRole('button', { name: 'Meta-Text' });
        fireEvent.click(metaTextButton);

        expect(mockOnChange).toHaveBeenCalledWith('metaText');
    });

    it('should be disabled when disabled prop is true', () => {
        render(<DocTypeSelect value="sourceDoc" onChange={mockOnChange} disabled={true} />);

        const sourceDocButton = screen.getByRole('button', { name: 'Source Document' });
        const metaTextButton = screen.getByRole('button', { name: 'Meta-Text' });

        expect(sourceDocButton).toBeDisabled();
        expect(metaTextButton).toBeDisabled();
    });

    it('should not call onChange when disabled button is clicked', () => {
        render(<DocTypeSelect value="sourceDoc" onChange={mockOnChange} disabled={true} />);

        const metaTextButton = screen.getByRole('button', { name: 'Meta-Text' });
        fireEvent.click(metaTextButton);

        expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should not call onChange when same button is clicked', () => {
        render(<DocTypeSelect value="sourceDoc" onChange={mockOnChange} />);

        const sourceDocButton = screen.getByRole('button', { name: 'Source Document' });
        fireEvent.click(sourceDocButton);

        // Should not call onChange when clicking the already selected button
        expect(mockOnChange).not.toHaveBeenCalled();
    });
});
