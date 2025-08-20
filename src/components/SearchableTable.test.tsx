/**
 * SearchableTable.test.tsx
 * ----------------------------------------------------------------------------
 * High-value integration tests for the searchable documents table:
 * - Filters items by title and shows empty state when no matches
 * - Clears search and refocuses input via the CloseButton
 * - Navigates to detail page when an item is clicked
 * - Calls delete mutation when delete button is clicked
 */
import '../setup-test'
import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { render, makeDocs } from '../test-utils'
import { SearchableTable } from './SearchableTable'

// Mock react-router's useNavigate but keep real exports for MemoryRouter, etc.
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

describe('SearchableTable', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    function setup(docs = makeDocs(5, 'Alpha')) {
        const deleteItemMutation = { mutate: vi.fn() } as any
        render(
            <SearchableTable
                documents={docs}
                showTitle={true}
                navigateToBase="/sourcedoc/"
                deleteItemMutation={deleteItemMutation}
            />
        )
        return { deleteItemMutation }
    }

    it('filters results by title and shows empty state for no match', () => {
        const docs = [
            { id: '1', title: 'Alpha Document' },
            { id: '2', title: 'Beta Notes' },
            { id: '3', title: 'Gamma File' },
        ]
        setup(docs)

        const input = screen.getByPlaceholderText(/search/i)
        fireEvent.change(input, { target: { value: 'be' } })

        // Only Beta should be visible
        expect(screen.queryByTestId('item-1')).not.toBeInTheDocument()
        expect(screen.getByTestId('item-2')).toBeInTheDocument()
        expect(screen.queryByTestId('item-3')).not.toBeInTheDocument()

        // No match -> empty state
        fireEvent.change(input, { target: { value: 'zzz' } })
        expect(screen.getByText(/no documents found/i)).toBeInTheDocument()
    })

    it('clears search and refocuses input when CloseButton clicked', () => {
        setup([
            { id: '1', title: 'Alpha' },
            { id: '2', title: 'Beta' },
        ])

        const input = screen.getByPlaceholderText(/search/i)
        fireEvent.change(input, { target: { value: 'alp' } })

        // Close button appears when there is text
        const closeBtn = screen.getByRole('button', { name: /close/i })
        fireEvent.click(closeBtn)

        expect((input as HTMLInputElement).value).toBe('')
        // Focus returns to input (jsdom focus is mocked in setup)
        expect(document.activeElement === input).toBe(true)
    })

    it('navigates to detail when item title is clicked', () => {
        setup([
            { id: '42', title: 'Alpha' },
        ])

        fireEvent.click(screen.getByTestId('item-42'))
        expect(mockNavigate).toHaveBeenCalledWith('/sourcedoc/42')
    })

    it('calls delete mutation when delete button is clicked', () => {
        const { deleteItemMutation } = setup([
            { id: '7', title: 'Alpha' },
        ])

        fireEvent.click(screen.getByTestId('delete-button-7'))
        expect(deleteItemMutation.mutate).toHaveBeenCalledWith('7')
    })
})
