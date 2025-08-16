// Centralized vi.mocks for documents data hooks used across tests
// Import in test files with: import '../tests/__mocks__/documentsData.mock'
// Then adjust exported spies as needed per test.
import { vi } from 'vitest'

export const docsSpies = {
    useSourceDocuments: vi.fn(() => ({ data: [], isLoading: false })),
    useMetatexts: vi.fn(() => ({ data: [], isLoading: false })),
    useAddMetatext: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
    useDeleteMetatext: vi.fn(() => ({ mutate: vi.fn() })),
    useDeleteSourceDocument: vi.fn(() => ({ mutate: vi.fn() })),
    useAddSourceDocument: vi.fn(() => ({ mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false })),
    useUpdateSourceDocument: vi.fn(() => ({ mutate: vi.fn() })),
}

vi.mock('@features/documents/useDocumentsData', () => docsSpies)
vi.mock('../../features/documents/useDocumentsData', () => docsSpies)
vi.mock('/Users/michaeldini/Dev/meta-text/src/features/documents/useDocumentsData', () => docsSpies)
