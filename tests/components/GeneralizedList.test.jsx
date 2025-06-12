import { render, screen, fireEvent } from '@testing-library/react';
import GeneralizedList from '../../src/components/GeneralizedList.jsx';
import { describe, it, expect, vi } from 'vitest';

describe('GeneralizedList', () => {
    it('renders empty message when no items', () => {
        render(<GeneralizedList items={[]} emptyMessage="Nothing here" />);
        expect(screen.getByText('Nothing here')).toBeInTheDocument();
    });

    it('renders items and handles click', () => {
        const items = [{ id: 1, title: 'Item 1' }];
        const onItemClick = vi.fn();
        const onDeleteClick = vi.fn();
        render(
            <GeneralizedList
                items={items}
                onItemClick={onItemClick}
                onDeleteClick={onDeleteClick}
                deleteLoading={{}}
                deleteError={{}}
            />
        );
        const item = screen.getByText('Item 1').closest('li') || screen.getByText('Item 1');
        fireEvent.click(item);
        expect(onItemClick).toHaveBeenCalledWith(1);
    });
});
