// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import SearchableList from '../../src/components/SearchableList';

// Mock DeleteButton
vi.mock('../../src/components/DeleteButton', () => ({
  __esModule: true,
  default: ({ onClick, disabled, label }) => (
    <button onClick={onClick} disabled={disabled} data-testid="delete-btn">{label || 'Delete'}</button>
  ),
}));

describe('SearchableList', () => {
  const items = [
    { id: 1, title: 'Alpha' },
    { id: 2, title: 'Beta' },
    { id: 3, title: 'Gamma' },
  ];
  let onItemClick, onDeleteClick;

  beforeEach(() => {
    onItemClick = vi.fn();
    onDeleteClick = vi.fn();
  });

  it('renders all items by default', () => {
    render(
      <SearchableList items={items} onItemClick={onItemClick} onDeleteClick={onDeleteClick} />
    );
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });

  it('filters items based on search input', () => {
    render(
      <SearchableList items={items} onItemClick={onItemClick} onDeleteClick={onDeleteClick} />
    );
    const input = screen.getByTestId('search-input').querySelector('input');
    fireEvent.change(input, { target: { value: 'be' } });
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.queryByText('Alpha')).toBeNull();
    expect(screen.queryByText('Gamma')).toBeNull();
  });

  it('calls onItemClick when an item is clicked', () => {
    render(
      <SearchableList items={items} onItemClick={onItemClick} onDeleteClick={onDeleteClick} />
    );
    fireEvent.click(screen.getByText('Alpha'));
    expect(onItemClick).toHaveBeenCalledWith(1);
  });

  it('calls onDeleteClick when delete is clicked', () => {
    render(
      <SearchableList items={items} onItemClick={onItemClick} onDeleteClick={onDeleteClick} />
    );
    fireEvent.click(screen.getAllByTestId('delete-btn')[0]);
    expect(onDeleteClick).toHaveBeenCalledWith(1, expect.any(Object));
  });

  it('disables delete button when deleteLoading is true', () => {
    render(
      <SearchableList
        items={items}
        onItemClick={onItemClick}
        onDeleteClick={onDeleteClick}
        deleteLoading={{ 1: true }}
      />
    );
    expect(screen.getAllByTestId('delete-btn')[0]).toBeDisabled();
  });

  it('shows delete error for an item', () => {
    render(
      <SearchableList
        items={items}
        onItemClick={onItemClick}
        onDeleteClick={onDeleteClick}
        deleteError={{ 2: 'Delete failed' }}
      />
    );
    expect(screen.getByText('Delete failed')).toBeInTheDocument();
  });

  it('shows "No items found." when filter returns nothing', () => {
    render(
      <SearchableList items={items} onItemClick={onItemClick} onDeleteClick={onDeleteClick} />
    );
    const input = screen.getByTestId('search-input').querySelector('input');
    fireEvent.change(input, { target: { value: 'zzz' } });
    expect(screen.getByText('No items found.')).toBeInTheDocument();
  });
});
