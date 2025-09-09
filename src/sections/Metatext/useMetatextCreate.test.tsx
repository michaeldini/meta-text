/* eslint-disable */
// Tests for useMetatextCreate hook
import '../../setup-test'
import React from 'react'
import { render } from '../../test-utils'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import '../../tests/__mocks__/documentsData.mock'
import { docsSpies } from '../../tests/__mocks__/documentsData.mock'

// Mock the documents hook that the hook uses
const mutateMock = vi.fn((payload: any, options?: any) => {
    // simulate immediate success to trigger onSuccess callback
    if (options?.onSuccess) options.onSuccess()
})
// Wire via centralized docsSpies
docsSpies.useAddMetatext.mockReturnValue({ mutate: mutateMock, isPending: false })

import { useMetatextCreate } from './useMetatextCreate'

// A small harness to expose the hook's handlers via DOM elements
function Harness() {
    const { title, loading, isSubmitDisabled, handleTitleChange, handleSourceDocChange, handleSubmit } = useMetatextCreate()
    return (
        <form onSubmit={handleSubmit}>
            <input data-testid="title-input" value={title} onChange={handleTitleChange} />
            <input data-testid="source-input" onChange={(e) => handleSourceDocChange(e.target.value)} />
            <button data-testid="submit-btn" type="submit" disabled={isSubmitDisabled}>{loading ? 'creating' : 'create'}</button>
        </form>
    )
}

describe('useMetatextCreate (hook)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        docsSpies.useAddMetatext.mockReturnValue({ mutate: mutateMock, isPending: false })
    })

    it('calls mutate with shaped payload and resets title on success', async () => {
        render(<Harness />)

        // fill title and source
        fireEvent.change(screen.getByTestId('title-input'), { target: { value: ' My Title ' } })
        fireEvent.change(screen.getByTestId('source-input'), { target: { value: '42' } })

        // wait for submit to become enabled
        await waitFor(() => expect(screen.getByTestId('submit-btn')).not.toBeDisabled())

        // submit
        fireEvent.click(screen.getByTestId('submit-btn'))

        // mutate called with numbers and trimmed title
        await waitFor(() => expect(mutateMock).toHaveBeenCalledTimes(1))
        expect(mutateMock).toHaveBeenCalledWith({ sourceDocId: 42, title: 'My Title' }, expect.any(Object))

        // after simulated success, title should be reset
        await waitFor(() => expect((screen.getByTestId('title-input') as HTMLInputElement).value).toBe(''))
    })

    it('does not submit when title empty or no source', () => {
        render(<Harness />)

        // empty title and no source
        fireEvent.click(screen.getByTestId('submit-btn'))
        expect(mutateMock).not.toHaveBeenCalled()

        // title only
        fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'A' } })
        fireEvent.click(screen.getByTestId('submit-btn'))
        expect(mutateMock).not.toHaveBeenCalled()
    })
})
