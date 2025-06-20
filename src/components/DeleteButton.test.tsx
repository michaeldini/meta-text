import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteButton from './DeleteButton';

describe('DeleteButton', () => {
    const mockOnClick = vi.fn();

    beforeEach(() => {
        mockOnClick.mockClear();
    });

    it('should render delete button with default props', () => {
        render(<DeleteButton onClick={mockOnClick} disabled={false} />);

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-label', 'Delete');
        expect(button).not.toBeDisabled();
    });

    it('should render with custom label', () => {
        render(<DeleteButton onClick={mockOnClick} disabled={false} label="Remove Item" />);

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Remove Item');
    });

    it('should be disabled when disabled prop is true', () => {
        render(<DeleteButton onClick={mockOnClick} disabled={true} />);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('should call onClick when clicked', () => {
        render(<DeleteButton onClick={mockOnClick} disabled={false} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
        render(<DeleteButton onClick={mockOnClick} disabled={true} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should render with custom icon', () => {
        const CustomIcon = () => <span data-testid="custom-icon">Custom</span>;
        render(<DeleteButton onClick={mockOnClick} disabled={false} icon={<CustomIcon />} />);

        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('should have correct test id', () => {
        render(<DeleteButton onClick={mockOnClick} disabled={false} />);

        expect(screen.getByTestId('delete-button')).toBeInTheDocument();
    });
});
