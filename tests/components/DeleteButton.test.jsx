import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import DeleteButton from '../../src/components/DeleteButton.jsx';

describe('DeleteButton', () => {
    it('renders with label', () => {
        render(<DeleteButton label="Delete" onClick={() => { }} />);
        expect(screen.getByTestId('delete-button')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        render(<DeleteButton label="Delete" onClick={handleClick} />);
        fireEvent.click(screen.getByTestId('delete-button'));
        expect(handleClick).toHaveBeenCalled();
    });

    it('is disabled when disabled prop is true', () => {
        render(<DeleteButton label="Delete" onClick={() => { }} disabled />);
        expect(screen.getByTestId('delete-button')).toBeDisabled();
    });
});
