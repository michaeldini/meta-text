/* eslint-disable */
// Component test for MetatextCreateForm
import '../../setup-test'
import React from 'react'
import { render } from '../../test-utils'
import { screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

let hookMock: any
const makeHandler = () => vi.fn((e?: any) => e && e.preventDefault && e.preventDefault())

// Provide a mutable mock object the module factory will return so tests can
// update hook outputs per-case.
hookMock = {
    title: '',
    loading: false,
    isSubmitDisabled: false,
    handleTitleChange: makeHandler(),
    handleSourceDocChange: makeHandler(),
    handleSubmit: makeHandler(),
}

vi.mock('./useMetatextCreate', () => ({
    useMetatextCreate: () => hookMock,
}))

import MetatextCreateForm from './MetatextCreateForm'

describe('MetatextCreateForm (component)', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        // reset hookMock to default per test
        hookMock.title = ''
        hookMock.loading = false
        hookMock.isSubmitDisabled = false
        hookMock.handleTitleChange = makeHandler()
        hookMock.handleSourceDocChange = makeHandler()
        hookMock.handleSubmit = makeHandler()
    })

    it('renders and calls handleSubmit when submit clicked and not disabled', () => {
        render(<MetatextCreateForm sourceDocs={[]} sourceDocsLoading={false} />)

        // header and inputs present
        expect(screen.getByText(/New/i)).toBeInTheDocument()
        expect(screen.getByTestId('title-input')).toBeInTheDocument()
        const submit = screen.getByTestId('submit-button')
        expect(submit).toBeInTheDocument()

        // submit the form directly -> handleSubmit called
        const form = submit.closest('form') as HTMLFormElement
        expect(form).toBeTruthy()
        fireEvent.submit(form)
        expect(hookMock.handleSubmit).toHaveBeenCalled()
    })

    it('disables submit button when isSubmitDisabled is true', () => {
        // set hook to disabled
        hookMock.isSubmitDisabled = true

        render(<MetatextCreateForm sourceDocs={[]} sourceDocsLoading={false} />)
        expect(screen.getByTestId('submit-button')).toBeDisabled()
    })
})
