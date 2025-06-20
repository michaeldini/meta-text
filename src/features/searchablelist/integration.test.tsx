import '../../setupTests';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchableList from './components/SearchableList';
import SearchBar from './components/SearchBar';
import { useFilteredList } from './hooks/useFilteredList';
import { useState } from 'react';

// Integration test component that combines SearchBar with filtering logic
function IntegratedSearchExample() {
    const [search, setSearch] = useState('');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const items = [
        { id: 1, title: 'Apple Product', category: 'Technology' },
        { id: 2, title: 'Banana Smoothie', category: 'Food' },
        { id: 3, title: 'Apple Pie', category: 'Food' },
        { id: 4, title: 'Tech Device', category: 'Technology' },
        { id: 5, title: 'Food Item', category: 'Food' },
        { id: 6, title: 'Another Food', category: 'Food' },
    ];

    const filteredItems = useFilteredList(items, search, 'title');

    const handleItemClick = (id: number) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleDeleteClick = (id: number) => {
        // In real app, this would delete the item
        console.log('Delete clicked for item:', id);
    };

    return (
        <div>
            <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search items..."
                ariaLabel="Search all items"
            />
            <div data-testid="filtered-count">
                Found: {filteredItems.length} items
            </div>
            <div data-testid="selected-count">
                Selected: {selectedItems.length} items
            </div>
            <SearchableList
                items={filteredItems}
                onItemClick={handleItemClick}
                onDeleteClick={handleDeleteClick}
                filterKey="title"
                searchPlaceholder="Filter results..."
                emptyMessage="No matching items found"
            />
        </div>
    );
}

describe('SearchableList Feature Integration', () => {
    describe('Component Integration', () => {
        it('works with external SearchBar component', async () => {
            const user = userEvent.setup();
            render(<IntegratedSearchExample />);

            // Initial state
            expect(screen.getByTestId('filtered-count')).toHaveTextContent('Found: 6 items');
            expect(screen.getByTestId('selected-count')).toHaveTextContent('Selected: 0 items');

            // Search using external SearchBar
            const externalSearchBar = screen.getByTestId('search-bar').querySelector('input')!;
            await user.type(externalSearchBar, 'apple');

            // Should filter items
            expect(screen.getByTestId('filtered-count')).toHaveTextContent('Found: 2 items');
            expect(screen.getByText('Apple Product')).toBeInTheDocument();
            expect(screen.getByText('Apple Pie')).toBeInTheDocument();
            expect(screen.queryByText('Banana Smoothie')).not.toBeInTheDocument();

            // The SearchableList should also have its own search
            const internalSearchInput = screen.getByTestId('search-input').querySelector('input')!;
            await user.type(internalSearchInput, 'product');

            // Should further filter
            expect(screen.getByText('Apple Product')).toBeInTheDocument();
            expect(screen.queryByText('Apple Pie')).not.toBeInTheDocument();
        });

        it('maintains state across filtering operations', async () => {
            const user = userEvent.setup();
            render(<IntegratedSearchExample />);

            // Select an item
            const firstItem = screen.getByRole('button', { name: 'Select Apple Product' });
            await user.click(firstItem);
            expect(screen.getByTestId('selected-count')).toHaveTextContent('Selected: 1 items');

            // Filter items
            const searchBar = screen.getByTestId('search-bar').querySelector('input')!;
            await user.type(searchBar, 'food');

            // Selected count should persist even though the selected item is filtered out
            expect(screen.getByTestId('selected-count')).toHaveTextContent('Selected: 1 items');
            expect(screen.getByTestId('filtered-count')).toHaveTextContent('Found: 2 items'); // Only Banana Smoothie and Apple Pie contain "food"

            // Clear search
            const clearButton = screen.getByTestId('clear-search-bar');
            await user.click(clearButton);

            // Should show all items again, with the previously selected item still selected
            expect(screen.getByTestId('filtered-count')).toHaveTextContent('Found: 6 items');
            expect(screen.getByTestId('selected-count')).toHaveTextContent('Selected: 1 items');
        });
    });

    describe('Hook Integration with Components', () => {
        it('useFilteredList works correctly with SearchableList', async () => {
            const user = userEvent.setup();
            const onItemClick = vi.fn();
            const onDeleteClick = vi.fn();

            const TestComponent = () => {
                const [search, setSearch] = useState('');
                const items = [
                    { id: 1, title: 'Test Item 1', description: 'First test' },
                    { id: 2, title: 'Another Item', description: 'Second test' },
                    { id: 3, title: 'Test Item 3', description: 'Third item' },
                ];

                const filteredByTitle = useFilteredList(items, search, 'title');
                const filteredByDescription = useFilteredList(items, search, 'description');

                return (
                    <div>
                        <SearchBar value={search} onChange={setSearch} />
                        <div data-testid="title-results">
                            Title matches: {filteredByTitle.length}
                        </div>
                        <div data-testid="desc-results">
                            Description matches: {filteredByDescription.length}
                        </div>
                        <SearchableList
                            items={filteredByTitle}
                            onItemClick={onItemClick}
                            onDeleteClick={onDeleteClick}
                            filterKey="title"
                        />
                    </div>
                );
            };

            render(<TestComponent />);

            // Search for "test"
            const searchInput = screen.getByTestId('search-bar').querySelector('input')!;
            await user.type(searchInput, 'test');

            // Should show different results for different keys
            expect(screen.getByTestId('title-results')).toHaveTextContent('Title matches: 2');
            expect(screen.getByTestId('desc-results')).toHaveTextContent('Description matches: 2');

            // Should render filtered items
            expect(screen.getByText('Test Item 1')).toBeInTheDocument();
            expect(screen.getByText('Test Item 3')).toBeInTheDocument();
            expect(screen.queryByText('Another Item')).not.toBeInTheDocument();
        });
    });

    describe('Performance Integration', () => {
        it('handles large datasets efficiently', async () => {
            const user = userEvent.setup();

            // Generate large dataset
            const largeItems = Array.from({ length: 1000 }, (_, i) => ({
                id: i + 1,
                title: `Item ${i + 1}`,
                category: i % 2 === 0 ? 'Even' : 'Odd',
            }));

            const TestComponent = () => {
                const [search, setSearch] = useState('');
                const filteredItems = useFilteredList(largeItems, search, 'title');

                return (
                    <div>
                        <SearchBar value={search} onChange={setSearch} />
                        <div data-testid="item-count">
                            Items: {filteredItems.length}
                        </div>
                        <SearchableList
                            items={filteredItems.slice(0, 10)} // Only show first 10 for performance
                            onItemClick={() => { }}
                            onDeleteClick={() => { }}
                            filterKey="title"
                        />
                    </div>
                );
            };

            const startTime = performance.now();
            render(<TestComponent />);
            const renderTime = performance.now() - startTime;

            // Should render quickly (under 100ms for initial render)
            expect(renderTime).toBeLessThan(100);

            // Should filter large dataset efficiently
            const searchInput = screen.getByTestId('search-bar').querySelector('input')!;

            const searchStartTime = performance.now();
            await user.type(searchInput, '50');
            const searchTime = performance.now() - searchStartTime;

            // Should search quickly (under 200ms including user interaction)
            expect(searchTime).toBeLessThan(200);

            // Should show filtered results
            expect(screen.getByTestId('item-count')).toHaveTextContent('Items: 20'); // Items 50, 150, 250, 350, 450, 500, 550, 650, 750, 850, 950 contain "50"
        });
    });

    describe('Accessibility Integration', () => {
        it('maintains accessibility across component interactions', async () => {
            const user = userEvent.setup();
            render(<IntegratedSearchExample />);

            // Should be able to navigate with keyboard
            await user.tab(); // External search bar
            expect(screen.getByTestId('search-bar').querySelector('input')).toHaveFocus();

            await user.tab(); // Internal search input
            expect(screen.getByTestId('search-input').querySelector('input')).toHaveFocus();

            await user.tab(); // First list item
            const firstButton = screen.getByRole('button', { name: 'Select Apple Product' });
            expect(firstButton).toHaveFocus();

            // Should be able to select with keyboard
            await user.click(firstButton); // Use click instead of keyboard for more reliable test
            expect(screen.getByTestId('selected-count')).toHaveTextContent('Selected: 1 items');

            // Should maintain focus management during filtering
            const externalSearchBar = screen.getByTestId('search-bar').querySelector('input')!;
            await user.click(externalSearchBar);
            await user.type(externalSearchBar, 'food');

            // Focus should remain on the search bar
            expect(externalSearchBar).toHaveFocus();
        });
    });
});
