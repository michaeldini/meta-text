// Unit tests for SearchableTable
// - Uses project test setup
// - Verifies rendering of items, delete mutation call, and search filtering
import '../setup-test'
import React from 'react'
import { render, makeDoc } from '../test-utils'
import { screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

import { SearchableTable } from './SearchableTable'

describe('SearchableTable', () => {
    it('renders empty state when no documents', () => {
        const mutateMock = vi.fn()
        render(
            <SearchableTable
                documents={[]}
                showTitle={true}
                navigateToBase="/docs/"
                deleteItemMutation={{ mutate: mutateMock } as any}
            />
        )
        expect(screen.getByText(/No documents found/i)).toBeInTheDocument()
    })

    it('renders items and calls delete mutation when delete button clicked', () => {
        const docs = [makeDoc('d1', 'Doc One')]
        const mutateMock = vi.fn()

        render(
            <SearchableTable
                documents={docs}
                showTitle={true}
                navigateToBase="/docs/"
                deleteItemMutation={{ mutate: mutateMock } as any}
            />
        )

        // heading and item exist
        expect(screen.getByText(/Open/i)).toBeInTheDocument()
        expect(screen.getByTestId('item-d1')).toBeInTheDocument()
        expect(screen.getByTestId('delete-button-d1')).toBeInTheDocument()

        // clicking delete should call mutation with id
        fireEvent.click(screen.getByTestId('delete-button-d1'))
        expect(mutateMock).toHaveBeenCalledWith('d1')
    })

    it('filters results using the search input', () => {
        const docs = [makeDoc('a', 'Apple'), makeDoc('b', 'Banana')]
        const mutateMock = vi.fn()

        render(
            <SearchableTable
                documents={docs}
                showTitle={false}
                navigateToBase="/x/"
                deleteItemMutation={{ mutate: mutateMock } as any}
            />
        )

        // both items present initially
        expect(screen.getByTestId('item-a')).toBeInTheDocument()
        expect(screen.getByTestId('item-b')).toBeInTheDocument()

        // type a search that matches only 'Apple' (case-insensitive)
        const input = screen.getByPlaceholderText('Search...') as HTMLInputElement
        fireEvent.change(input, { target: { value: 'app' } })

        // item-a remains, item-b is gone
        expect(screen.getByTestId('item-a')).toBeInTheDocument()
        expect(screen.queryByTestId('item-b')).toBeNull()

        // type a search that matches no items -> should show no results message
        fireEvent.change(input, { target: { value: ' zzz ' } }) // leading/trailing spaces are trimmed
        expect(screen.getByText(/No documents found/i)).toBeInTheDocument()
    })

    it('shows/hides title based on showTitle prop', () => {
        const docs = [{ id: 'a', title: 'Apple' }]
        const mutateMock = vi.fn()

        const { rerender } = render(
            <SearchableTable
                documents={docs}
                showTitle={true}
                navigateToBase="/x/"
                deleteItemMutation={{ mutate: mutateMock } as any}
            />
        )
        expect(screen.getByText(/Open/i)).toBeInTheDocument()

        rerender(
            <SearchableTable
                documents={docs}
                showTitle={false}
                navigateToBase="/x/"
                deleteItemMutation={{ mutate: mutateMock } as any}
            />
        )
        expect(screen.queryByText(/Open/i)).toBeNull()
    })

    it('shows clear button and clears input + focuses input on click', () => {
        const docs = [{ id: 'a', title: 'Apple' }]
        const mutateMock = vi.fn()

        render(
            <SearchableTable
                documents={docs}
                showTitle={true}
                navigateToBase="/x/"
                deleteItemMutation={{ mutate: mutateMock } as any}
            />
        )

        const input = screen.getByPlaceholderText('Search...') as HTMLInputElement
        input.focus()
        fireEvent.change(input, { target: { value: 'Ap' } })
        // Clear (x) button should appear in the input group
        const clear = screen.getByLabelText('Close')
        fireEvent.click(clear)
        expect(input.value).toBe('')
        expect(document.activeElement).toBe(input)
    })

    it('clicking delete does not navigate', () => {
        // Spy on location push via a mock navigate in the navigation test, here we just ensure DOM stays
        const docs = [{ id: 'a', title: 'Apple' }]
        const mutateMock = vi.fn()

        render(
            <SearchableTable
                documents={docs}
                showTitle={true}
                navigateToBase="/x/"
                deleteItemMutation={{ mutate: mutateMock } as any}
            />
        )
        fireEvent.click(screen.getByTestId('delete-button-a'))
        expect(mutateMock).toHaveBeenCalledWith('a')
        // Item still present (no navigation occurred here)
        expect(screen.getByTestId('item-a')).toBeInTheDocument()
    })
})
