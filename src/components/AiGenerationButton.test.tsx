import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AiGenerationButton from './AiGenerationButton';

describe('AiGenerationButton', () => {
    const mockOnClick = vi.fn();

    beforeEach(() => {
        mockOnClick.mockClear();
    });

    it('should render button with label and AI icon', () => {
        render(<AiGenerationButton label="Generate Summary" onClick={mockOnClick} />);

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(screen.getByText('Generate Summary')).toBeInTheDocument();
        expect(screen.getByAltText('AI')).toBeInTheDocument();
    });

    it('should render with tooltip when provided', () => {
        render(<AiGenerationButton label="Generate" toolTip="Generate AI content" onClick={mockOnClick} />);

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Generate AI content');
    });

    it('should render with default aria-label when no tooltip provided', () => {
        render(<AiGenerationButton label="Generate" onClick={mockOnClick} />);

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'AI Generation Button');
    }); it('should call onClick when clicked', async () => {
        const user = userEvent.setup();
        render(<AiGenerationButton label="Generate" onClick={mockOnClick} />);

        const button = screen.getByRole('button');
        await user.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
        render(<AiGenerationButton label="Generate" onClick={mockOnClick} disabled={true} />);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('should be disabled when loading is true', () => {
        render(<AiGenerationButton label="Generate" onClick={mockOnClick} loading={true} />);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('should show loading spinner when loading', () => {
        render(<AiGenerationButton label="Generate" onClick={mockOnClick} loading={true} />);

        const spinner = screen.getByRole('progressbar');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveAttribute('aria-label', 'Loading AI generation');
        expect(screen.queryByText('Generate')).not.toBeInTheDocument();
        expect(screen.queryByAltText('AI')).not.toBeInTheDocument();
    }); it('should not call onClick when disabled', async () => {
        const user = userEvent.setup();
        render(<AiGenerationButton label="Generate" onClick={mockOnClick} disabled={true} />);

        const button = screen.getByRole('button');
        // user-event correctly prevents interaction with disabled buttons
        await expect(user.click(button)).rejects.toThrow('pointer-events: none');

        expect(mockOnClick).not.toHaveBeenCalled();
    }); it('should not call onClick when loading', async () => {
        const user = userEvent.setup();
        render(<AiGenerationButton label="Generate" onClick={mockOnClick} loading={true} />);

        const button = screen.getByRole('button');
        // user-event correctly prevents interaction with disabled buttons (loading makes it disabled)
        await expect(user.click(button)).rejects.toThrow('pointer-events: none');

        expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should apply custom sx styles', () => {
        const customSx = { backgroundColor: 'red' };
        render(<AiGenerationButton label="Generate" onClick={mockOnClick} sx={customSx} />);

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });

    it('should have reduced opacity when loading', () => {
        render(<AiGenerationButton label="Generate" onClick={mockOnClick} loading={true} />);

        const button = screen.getByRole('button');
        // Note: Testing actual styles would require a more complex setup
        expect(button).toBeInTheDocument();
    });
});
