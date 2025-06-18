import '../../../setupTests';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SearchableList, { SearchableListProps } from './SearchableList';

interface Item {
    id: number;
    title: string;
    extra?: string;
}

describe('SearchableList', () => {
    const items: Item[] = [
        { id: 1, title: 'First Item' },
        { id: 2, title: 'Second Item' },
        { id: 3, title: 'Another' },
    ];
    const onItemClick = vi.fn();
    const onDeleteClick = vi.fn();

    const defaultProps: SearchableListProps<Item> = {
        items,
        onItemClick,
        onDeleteClick,
        filterKey: 'title',
    };

    it('renders all items initially', () => {
        render(<SearchableList {...defaultProps} />);
        expect(screen.getByText('First Item')).toBeInTheDocument();
        expect(screen.getByText('Second Item')).toBeInTheDocument();
        expect(screen.getByText('Another')).toBeInTheDocument();
    });

    it('filters items based on search input', () => {
        render(<SearchableList {...defaultProps} />);
        const input = screen.getByTestId('search-input').querySelector('input')!;
        fireEvent.change(input, { target: { value: 'Second' } });
        expect(screen.getByText('Second Item')).toBeInTheDocument();
        expect(screen.queryByText('First Item')).toBeNull();
        expect(screen.queryByText('Another')).toBeNull();
    });

    it('calls onItemClick when an item is clicked', () => {
        render(<SearchableList {...defaultProps} />);
        fireEvent.click(screen.getByRole('button', { name: 'First Item' }));
        expect(onItemClick).toHaveBeenCalledWith(1);
    });

    it('calls onDeleteClick when delete button is clicked', () => {
        render(<SearchableList {...defaultProps} />);
        const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
        expect(deleteButtons).toHaveLength(3); // One for each item
        fireEvent.click(deleteButtons[0]);
        expect(onDeleteClick).toHaveBeenCalled();
    });

    it('shows no items found when filter returns nothing', () => {
        render(<SearchableList {...defaultProps} />);
        const input = screen.getByTestId('search-input').querySelector('input')!;
        fireEvent.change(input, { target: { value: 'zzz' } });
        expect(screen.getByText('No items found.')).toBeInTheDocument();
    });
});
