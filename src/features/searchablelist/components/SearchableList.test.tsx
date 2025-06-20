import '../../../setupTests';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchableList, { SearchableListProps } from './SearchableList';

interface TestItem {
    id: number;
    title: string;
    category?: string;
    description?: string;
}

describe('SearchableList', () => {
    const items: TestItem[] = [
        { id: 1, title: 'First Item', category: 'Category A' },
        { id: 2, title: 'Second Item', category: 'Category B' },
        { id: 3, title: 'Another', category: 'Category A' },
        { id: 4, title: 'Special Item', description: 'This is special' },
    ];

    const onItemClick = vi.fn();
    const onDeleteClick = vi.fn();

    const defaultProps: SearchableListProps<TestItem> = {
        items,
        onItemClick,
        onDeleteClick,
        filterKey: 'title',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('renders all items initially', () => {
            render(<SearchableList {...defaultProps} />);

            expect(screen.getByText('First Item')).toBeInTheDocument();
            expect(screen.getByText('Second Item')).toBeInTheDocument();
            expect(screen.getByText('Another')).toBeInTheDocument();
            expect(screen.getByText('Special Item')).toBeInTheDocument();
        });

        it('renders with custom props', () => {
            render(
                <SearchableList
                    {...defaultProps}
                    searchPlaceholder="Find your item..."
                    emptyMessage="Nothing found"
                    ariaLabel="custom list"
                />
            );

            expect(screen.getByPlaceholderText('Find your item...')).toBeInTheDocument();
            expect(screen.getByLabelText('custom list')).toBeInTheDocument();
        });

        it('shows search icon and input', () => {
            render(<SearchableList {...defaultProps} />);

            expect(screen.getByTestId('search-input')).toBeInTheDocument();
            expect(screen.getByLabelText('Search items')).toBeInTheDocument();
        });

        it('renders proper ARIA attributes', () => {
            render(<SearchableList {...defaultProps} />);

            const region = screen.getByRole('region');
            expect(region).toHaveAttribute('aria-label', 'searchable list');

            const list = screen.getByRole('list');
            expect(list).toHaveAttribute('aria-label', '4 items found');
        });
    });

    describe('Search Functionality', () => {
        it('filters items based on search input', async () => {
            const user = userEvent.setup();
            render(<SearchableList {...defaultProps} />);

            const input = screen.getByTestId('search-input').querySelector('input')!;
            await user.type(input, 'Second');

            expect(screen.getByText('Second Item')).toBeInTheDocument();
            expect(screen.queryByText('First Item')).not.toBeInTheDocument();
            expect(screen.queryByText('Another')).not.toBeInTheDocument();
        });

        it('filters by different filter keys', async () => {
            const user = userEvent.setup();
            render(<SearchableList {...defaultProps} filterKey="category" />);

            const input = screen.getByTestId('search-input').querySelector('input')!;
            await user.type(input, 'Category A');

            const categoryAElements = screen.getAllByText('Category A');
            expect(categoryAElements).toHaveLength(2); // Should show 2 items with Category A
            expect(screen.queryByText('Category B')).not.toBeInTheDocument();
        });

        it('shows clear button when search has content', async () => {
            const user = userEvent.setup();
            render(<SearchableList {...defaultProps} />);

            const input = screen.getByTestId('search-input').querySelector('input')!;
            await user.type(input, 'test');

            expect(screen.getByTestId('clear-search')).toBeInTheDocument();
        });

        it('clears search when clear button is clicked', async () => {
            const user = userEvent.setup();
            render(<SearchableList {...defaultProps} />);

            const input = screen.getByTestId('search-input').querySelector('input')!;
            await user.type(input, 'Second');

            expect(screen.getByText('Second Item')).toBeInTheDocument();
            expect(screen.queryByText('First Item')).not.toBeInTheDocument();

            const clearButton = screen.getByTestId('clear-search');
            await user.click(clearButton);

            expect(input).toHaveValue('');
            expect(screen.getByText('First Item')).toBeInTheDocument();
            expect(screen.getByText('Second Item')).toBeInTheDocument();
        });

        it('shows custom empty message when no results found', async () => {
            const user = userEvent.setup();
            render(
                <SearchableList
                    {...defaultProps}
                    emptyMessage="Custom empty message"
                />
            );

            const input = screen.getByTestId('search-input').querySelector('input')!;
            await user.type(input, 'nonexistent');

            expect(screen.getByText('Custom empty message')).toBeInTheDocument();
        });

        it('trims whitespace from search', async () => {
            const user = userEvent.setup();
            render(<SearchableList {...defaultProps} />);

            const input = screen.getByTestId('search-input').querySelector('input')!;
            await user.type(input, '  Second  ');

            expect(screen.getByText('Second Item')).toBeInTheDocument();
            expect(screen.queryByText('First Item')).not.toBeInTheDocument();
        });
    });

    describe('Interactions', () => {
        it('calls onItemClick when an item is clicked', async () => {
            const user = userEvent.setup();
            render(<SearchableList {...defaultProps} />);

            const itemButton = screen.getByRole('button', { name: 'Select First Item' });
            await user.click(itemButton);

            expect(onItemClick).toHaveBeenCalledWith(1);
        });

        it('calls onItemClick when Enter is pressed on an item', async () => {
            const user = userEvent.setup();
            render(<SearchableList {...defaultProps} />);

            const itemButton = screen.getByRole('button', { name: 'Select First Item' });
            itemButton.focus();
            await user.keyboard('{Enter}');

            expect(onItemClick).toHaveBeenCalledWith(1);
        });

        it('calls onItemClick when Space is pressed on an item', async () => {
            const user = userEvent.setup();
            render(<SearchableList {...defaultProps} />);

            const itemButton = screen.getByRole('button', { name: 'Select First Item' });
            itemButton.focus();
            await user.keyboard(' ');

            expect(onItemClick).toHaveBeenCalledWith(1);
        });

        it('calls onDeleteClick when delete button is clicked', async () => {
            const user = userEvent.setup();
            render(<SearchableList {...defaultProps} />);

            const deleteButtons = screen.getAllByRole('button', { name: /Delete/ });
            expect(deleteButtons).toHaveLength(4);

            await user.click(deleteButtons[0]);
            expect(onDeleteClick).toHaveBeenCalledWith(1, expect.any(Object));
        });

        it('disables delete button when loading', () => {
            render(
                <SearchableList
                    {...defaultProps}
                    deleteLoading={{ 1: true }}
                />
            );

            const deleteButton = screen.getByRole('button', { name: 'Delete First Item' });
            expect(deleteButton).toBeDisabled();
        });
    });

    describe('Edge Cases', () => {
        it('handles empty items array', () => {
            render(<SearchableList {...defaultProps} items={[]} />);

            expect(screen.getByText('No items found.')).toBeInTheDocument();
        });

        it('handles items with null/undefined filter key values', () => {
            const itemsWithNulls: TestItem[] = [
                { id: 1, title: 'Valid Item' },
                { id: 2, title: null as any },
                { id: 3, title: undefined as any },
            ];

            render(
                <SearchableList
                    items={itemsWithNulls}
                    onItemClick={onItemClick}
                    onDeleteClick={onDeleteClick}
                    filterKey="title"
                />
            );

            expect(screen.getByText('Valid Item')).toBeInTheDocument();
            // Items with null/undefined should still render but with empty text
            const listItems = screen.getAllByRole('listitem');
            expect(listItems).toHaveLength(3);
        });

        it('is case insensitive', async () => {
            const user = userEvent.setup();
            render(<SearchableList {...defaultProps} />);

            const input = screen.getByTestId('search-input').querySelector('input')!;
            await user.type(input, 'FIRST');

            expect(screen.getByText('First Item')).toBeInTheDocument();
        });

        it('updates list when items prop changes', () => {
            const { rerender } = render(<SearchableList {...defaultProps} />);

            expect(screen.getByText('First Item')).toBeInTheDocument();

            const newItems = [{ id: 5, title: 'New Item' }];
            rerender(
                <SearchableList
                    items={newItems}
                    onItemClick={onItemClick}
                    onDeleteClick={onDeleteClick}
                    filterKey="title"
                />
            );

            expect(screen.queryByText('First Item')).not.toBeInTheDocument();
            expect(screen.getByText('New Item')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('has proper focus management', async () => {
            const user = userEvent.setup();
            render(<SearchableList {...defaultProps} />);

            // Tab through the interface
            await user.tab(); // Search input
            const searchInput = screen.getByTestId('search-input').querySelector('input')!;
            expect(searchInput).toHaveFocus();

            await user.tab(); // First item
            const firstItem = screen.getByRole('button', { name: 'Select First Item' });
            expect(firstItem).toHaveFocus();
        });

        it('provides meaningful labels for screen readers', () => {
            render(<SearchableList {...defaultProps} />);

            const deleteButtons = screen.getAllByRole('button', { name: /Delete/ });
            expect(deleteButtons[0]).toHaveAttribute('aria-label', 'Delete First Item');

            const selectButtons = screen.getAllByRole('button', { name: /Select/ });
            expect(selectButtons[0]).toHaveAttribute('aria-label', 'Select First Item');
        });

        it('updates aria-label based on filtered results', async () => {
            const user = userEvent.setup();
            render(<SearchableList {...defaultProps} />);

            const list = screen.getByRole('list');
            expect(list).toHaveAttribute('aria-label', '4 items found');

            const input = screen.getByTestId('search-input').querySelector('input')!;
            await user.type(input, 'First');

            expect(list).toHaveAttribute('aria-label', '1 item found');
        });
    });
});
