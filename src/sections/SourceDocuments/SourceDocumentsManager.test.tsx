// Unit test for SourceDocumentsManager
import '../../setup-test'
import React from 'react'
import { render, makeDoc, makeDocs } from '../../test-utils'
import { screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import '../../tests/__mocks__/documentsData.mock'
import { docsSpies } from '../../tests/__mocks__/documentsData.mock'

const mutateMock = vi.fn()

// (No SearchableTable mock here — we assert against the real table markup below)
vi.mock('./SourceDocUploadForm', () => ({
    default: () => <div data-testid="upload-form">upload</div>
}))

vi.mock('@components/SectionStack', () => ({
    default: (props: any) => <section data-testid="section-stack">{props.children}</section>,
}))

import SourceDocumentsManager from './SourceDocumentsManager'

describe('SourceDocumentsManager (unit)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        docsSpies.useDeleteSourceDocument.mockReturnValue({ mutate: mutateMock })
    })

    it('renders heading and calls delete mutation when delete button clicked', () => {
        const sourceDocs = [makeDoc('sd-1', 'Source One')]

        render(<SourceDocumentsManager sourceDocs={sourceDocs} />)

        expect(screen.getByText(/Sources/i)).toBeInTheDocument()
        // real SearchableTable renders item and delete button test ids
        expect(screen.getByTestId('item-sd-1')).toBeInTheDocument()
        expect(screen.getByTestId('delete-button-sd-1')).toBeInTheDocument()

        fireEvent.click(screen.getByTestId('delete-button-sd-1'))
        expect(mutateMock).toHaveBeenCalledWith('sd-1')
    })

    it('renders empty state and upload form when no source docs', () => {
        render(<SourceDocumentsManager sourceDocs={[]} />)

        expect(screen.getByText(/Sources/i)).toBeInTheDocument()
        expect(screen.getByText(/No documents found/i)).toBeInTheDocument()
        expect(screen.getByTestId('upload-form')).toBeInTheDocument()
    })

    it('renders table (bounded scroll area) when many items', () => {
        const many = makeDocs(30, 'Src').map(d => ({ ...d, id: `sd-${d.id}` }))
        render(<SourceDocumentsManager sourceDocs={many} />)
        expect(screen.getByRole('table')).toBeInTheDocument()
    })
})
