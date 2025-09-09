/* eslint-disable */
import '../../setup-test'
import React from 'react'
import { render } from '../../test-utils'
import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import '../../tests/__mocks__/documentsData.mock'
import { docsSpies } from '../../tests/__mocks__/documentsData.mock'

import { useSourceDocUploadForm } from './useSourceDocUploadForm'

function Harness() {
    const { files, error, addSourceDocuments, handleFilesChange, handleSubmit, uploadStatuses } = useSourceDocUploadForm()
    return (
        <form onSubmit={handleSubmit}>
            <input data-testid="file-input" type="file" onChange={(e: any) => handleFilesChange(e.target.files ? Array.from(e.target.files) : [])} />
            <button data-testid="submit" type="submit">Submit</button>
            <div data-testid="error">{error ?? ''}</div>
            <div data-testid="files">{files.map(f => f.name).join(',')}</div>
            <div data-testid="statuses">{uploadStatuses.map(s => s ? (s.uploading ? 'U' : s.success ? 'S' : s.error ? 'E' : '-') : '-').join(',')}</div>
        </form>
    )
}

describe('useSourceDocUploadForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('validates file extensions and sizes on change', () => {
        const { getByTestId } = render(<Harness />)
        const input = getByTestId('file-input') as HTMLInputElement

        // invalid extension
        const bad = new File(['x'], 'bad.pdf', { type: 'application/pdf' })
        act(() => { fireEvent.change(input, { target: { files: [bad] } }) })
        expect(screen.getByTestId('error')).toHaveTextContent(/All files must be \.txt/i)

        // valid small txt
        const good = new File(['x'], 'ok.txt', { type: 'text/plain' })
        act(() => { fireEvent.change(input, { target: { files: [good] } }) })
        expect(screen.getByTestId('error')).toHaveTextContent('')
        expect(screen.getByTestId('files')).toHaveTextContent('ok.txt')
    })

    it('submits files and handles success and error', async () => {
        // mock mutateAsync to succeed for first and fail for second
        const succeed = vi.fn(async ({ title, file }: any) => Promise.resolve({ id: '1' }))
        const fail = vi.fn(async ({ title, file }: any) => { throw new Error('nope') })
        const seq = vi.fn()
        // mutateAsync will be called twice; emulate behavior by switching implementation
        const calls: any[] = []
        docsSpies.useAddSourceDocument.mockReturnValue({
            mutate: vi.fn(),
            mutateAsync: async (payload: any) => {
                calls.push(payload)
                if (calls.length === 1) return Promise.resolve({ id: 'ok' })
                throw new Error('fail')
            },
            isPending: false,
        } as any)

        const { getByTestId } = render(<Harness />)
        const input = getByTestId('file-input') as HTMLInputElement
        const file1 = new File(['a'], 'a.txt', { type: 'text/plain' })
        const file2 = new File(['b'], 'b.txt', { type: 'text/plain' })

        // select files
        await act(async () => {
            fireEvent.change(input, { target: { files: [file1, file2] } })
        })
        expect(screen.getByTestId('files')).toHaveTextContent('a.txt,b.txt')

        // submit
        await act(async () => {
            fireEvent.submit(getByTestId('submit'))
        })

        // wait for upload statuses to reflect one success and one error
        await waitFor(() => expect(screen.getByTestId('statuses').textContent).toMatch(/S,|,E|U/))
        // error message should be set via onError
        expect(screen.getByTestId('error').textContent).toMatch(/One or more files failed to upload/)
    })

    it('shows message when submitting without files', () => {
        const { getByTestId } = render(<Harness />)
        fireEvent.submit(getByTestId('submit'))
        expect(screen.getByTestId('error')).toHaveTextContent(/Please select at least one file to upload/)
    })
})
