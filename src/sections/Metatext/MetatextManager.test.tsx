// Unit test for MetatextManager
// - Loads repo test setup
// - Mocks heavy child components so we only test MetatextManager wiring
// - Mocks `useDeleteMetatext` and asserts delete is invoked
import '../../setup-test'
import React from 'react'
import { render, makeDoc, makeDocs } from '../../test-utils'
import { screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import '../../tests/__mocks__/documentsData.mock'
import { docsSpies } from '../../tests/__mocks__/documentsData.mock'

// Create a top-level mutate mock and wire it via centralized docsSpies
const mutateMock = vi.fn()

// Mock heavy UI children so we control rendering and interactions
vi.mock('./MetatextCreateForm', () => ({
    default: (props: any) => <div data-testid="metatext-create">create</div>,
}))

vi.mock('@components/SectionStack', () => ({
    default: (props: any) => <section data-testid="section-stack">{props.children}</section>,
}))

import MetatextManager from './MetatextManager'

describe('MetatextManager (unit)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        docsSpies.useDeleteMetatext.mockReturnValue({ mutate: mutateMock })
    })

    it('renders heading and calls delete mutation when delete button clicked', () => {
        const metatexts = [makeDoc('mt-1', 'One')]
        const sourceDocs: any[] = []

        render(<MetatextManager metatexts={metatexts} sourceDocs={sourceDocs} />)

        // heading is present
        expect(screen.getByText(/Metatexts/i)).toBeInTheDocument()

        // real table renders item button and delete button
        expect(screen.getByTestId('item-mt-1')).toBeInTheDocument()
        expect(screen.getByTestId('delete-button-mt-1')).toBeInTheDocument()

        // click delete button -> mutate should be called
        fireEvent.click(screen.getByTestId('delete-button-mt-1'))
        expect(mutateMock).toHaveBeenCalledWith('mt-1')
    })

    it('renders empty state and create form when no metatexts', () => {
        render(<MetatextManager metatexts={[]} sourceDocs={[]} />)

        expect(screen.getByText(/Metatexts/i)).toBeInTheDocument()
        expect(screen.getByText(/No documents found/i)).toBeInTheDocument()
        expect(screen.getByTestId('metatext-create')).toBeInTheDocument()
    })

    it('renders table (bounded scroll area) when many items', () => {
        const many = makeDocs(25, 'Meta').map((d) => ({ ...d, id: `mt-${d.id}` }))
        render(<MetatextManager metatexts={many} sourceDocs={[]} />)
        // Table should be present
        expect(screen.getByRole('table')).toBeInTheDocument()
    })
})
