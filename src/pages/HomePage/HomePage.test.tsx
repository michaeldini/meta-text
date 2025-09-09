/* eslint-disable */
// Smoke test for the real HomePage component.
// Load test setup first (JSDOM mocks) and then mock the data hooks and
// heavy child components before importing HomePage so module initialization
// is safe and deterministic.
import '../../setup-test'
import React from 'react'
import { vi } from 'vitest'
import { render } from '../../test-utils'
import { screen } from '@testing-library/react'
import '../../tests/__mocks__/documentsData.mock'
import { docsSpies } from '../../tests/__mocks__/documentsData.mock'

// Mock heavy child components so they don't pull more hooks at import time
vi.mock('@sections/Metatext/MetatextManager', () => ({
    default: (props: any) => React.createElement('div', { 'data-testid': 'metatext-manager' }, 'metatext'),
}))
vi.mock('@sections/SourceDocuments/SourceDocumentsManager', () => ({
    default: (props: any) => React.createElement('div', { 'data-testid': 'source-documents-manager' }, 'source-docs'),
}))


import HomePage from './HomePage'

describe('HomePage (integration smoke test)', () => {
    it('renders homepage content element', async () => {
        docsSpies.useSourceDocuments.mockReturnValue({ data: [], isLoading: false })
        docsSpies.useMetatexts.mockReturnValue({ data: [], isLoading: false })
        render(<HomePage />)
        const el = await screen.findByTestId('homepage-content')
        expect(el).toBeInTheDocument()
        expect(el).toHaveTextContent('Welcome')
    })
})
