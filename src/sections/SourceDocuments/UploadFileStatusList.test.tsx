import '../../setup-test'
import React from 'react'
import { render } from '../../test-utils'
import { screen } from '@testing-library/react'
import UploadFileStatusList from './UploadFileStatusList'

function makeFile(name: string, size = 1000) {
    const file = new File(['x'.repeat(size)], name, { type: 'text/plain' })
    return file
}

describe('UploadFileStatusList', () => {
    it('returns null when no files', () => {
        render(<UploadFileStatusList files={[]} statuses={[]} />)
        // Ensure the main label is not present when there are no files
        expect(() => screen.getByText(/Files to upload:/i)).toThrow()
    })

    it('renders ready state and single file tag', () => {
        const f = makeFile('a.txt')
        render(<UploadFileStatusList files={[f]} statuses={[{ uploading: false, success: false, error: null }]} />)
        expect(screen.getByText(/Ready \(1\)/i)).toBeInTheDocument()
        expect(screen.getByText(/a.txt/)).toBeInTheDocument()
    })

    it('renders uploading and completed with error states', () => {
        const f1 = makeFile('one.txt')
        const f2 = makeFile('two.txt')
        const statuses = [
            { uploading: true, success: false, error: null },
            { uploading: false, success: false, error: 'Failed to upload' },
        ]
        render(<UploadFileStatusList files={[f1, f2]} statuses={statuses} />)

        // Text is rendered exactly as 'Uploading 2/2...' for two files
        expect(screen.getByText('Uploading 2/2...')).toBeInTheDocument()
        expect(screen.getByText(/two.txt \(Error\)/i)).toBeInTheDocument()
    })
})
