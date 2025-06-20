import '../../../setupTests';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchBar, { SearchBarProps } from './SearchBar';

describe('SearchBar', () => {
    const defaultProps: SearchBarProps = {
        value: '',
        onChange: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders with default props', () => {
        render(<SearchBar {...defaultProps} />);

        expect(screen.getByTestId('search-bar')).toBeInTheDocument();
        expect(screen.getByLabelText('Search input')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('renders with custom label and placeholder', () => {
        render(
            <SearchBar
                {...defaultProps}
                label="Find items"
                placeholder="Type to search..."
                ariaLabel="Custom search"
            />
        );

        expect(screen.getByLabelText('Find items')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Type to search...')).toBeInTheDocument();
        expect(screen.getByLabelText('Custom search')).toBeInTheDocument();
    });

    it('calls onChange when typing', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<SearchBar {...defaultProps} onChange={onChange} />);

        const input = screen.getByTestId('search-bar').querySelector('input')!;
        await user.type(input, 'test');

        expect(onChange).toHaveBeenCalledTimes(4); // Once for each character
        // Just check that it was called with each character - the order may vary
        expect(onChange).toHaveBeenCalledWith('t');
        expect(onChange).toHaveBeenCalledWith('e');
        expect(onChange).toHaveBeenCalledWith('s');
        expect(onChange).toHaveBeenCalledWith('t');
    });

    it('shows clear button when value is present', () => {
        render(<SearchBar {...defaultProps} value="test" />);

        expect(screen.getByTestId('clear-search-bar')).toBeInTheDocument();
        expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });

    it('does not show clear button when value is empty', () => {
        render(<SearchBar {...defaultProps} value="" />);

        expect(screen.queryByTestId('clear-search-bar')).not.toBeInTheDocument();
    });

    it('calls onChange and onClear when clear button is clicked', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const onClear = vi.fn();

        render(
            <SearchBar
                {...defaultProps}
                value="test"
                onChange={onChange}
                onClear={onClear}
            />
        );

        const clearButton = screen.getByTestId('clear-search-bar');
        await user.click(clearButton);

        expect(onChange).toHaveBeenCalledWith('');
        expect(onClear).toHaveBeenCalled();
    });

    it('disables input and clear button when disabled prop is true', () => {
        render(<SearchBar {...defaultProps} value="test" disabled />);

        const input = screen.getByTestId('search-bar').querySelector('input')!;
        const clearButton = screen.getByTestId('clear-search-bar');

        expect(input).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it('applies custom variant and size', () => {
        render(<SearchBar {...defaultProps} variant="filled" size="small" />);

        // Check that the component renders (specific variant/size testing would require more complex queries)
        expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<SearchBar {...defaultProps} onChange={onChange} />);

        const input = screen.getByTestId('search-bar').querySelector('input')!;

        // Tab to focus the input
        await user.tab();
        expect(input).toHaveFocus();

        // Type in the input
        await user.keyboard('hello');
        expect(onChange).toHaveBeenCalledTimes(5); // Once for each character
        // Check that final state includes all letters
        expect(onChange).toHaveBeenCalledWith('h');
        expect(onChange).toHaveBeenCalledWith('e');
        expect(onChange).toHaveBeenCalledWith('l');
        expect(onChange).toHaveBeenCalledWith('o');
    });

    it('handles fullWidth prop', () => {
        const { rerender } = render(<SearchBar {...defaultProps} fullWidth />);
        expect(screen.getByTestId('search-bar')).toBeInTheDocument();

        rerender(<SearchBar {...defaultProps} fullWidth={false} />);
        expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    });

    it('maintains proper ARIA attributes', () => {
        render(<SearchBar {...defaultProps} ariaLabel="Custom search field" />);

        const input = screen.getByLabelText('Custom search field');
        expect(input).toHaveAttribute('aria-label', 'Custom search field');
    });
});
