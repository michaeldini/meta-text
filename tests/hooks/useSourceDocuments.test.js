import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useSourceDocuments } from '../../src/hooks/useSourceDocuments';
import { act } from 'react-dom/test-utils';

// Mock the service function
vi.mock('../../src/services/sourceDocumentService', () => ({
    fetchSourceDocuments: vi.fn().mockResolvedValue([
        { id: 1, name: 'Doc 1' },
        { id: 2, name: 'Doc 2' },
    ]),
}));

describe('useSourceDocuments', () => {
    it('should fetch and return source documents', async () => {
        const { result } = renderHook(() => useSourceDocuments());
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.docs).toEqual([
            { id: 1, name: 'Doc 1' },
            { id: 2, name: 'Doc 2' },
        ]);
        expect(result.current.error).toBe("");
    });

    it('should set error if fetch fails', async () => {
        const errorMsg = 'Failed to fetch';
        const { fetchSourceDocuments } = await import('../../src/services/sourceDocumentService');
        fetchSourceDocuments.mockRejectedValueOnce(new Error(errorMsg));
        const { result } = renderHook(() => useSourceDocuments());
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.docs).toEqual([]);
        expect(result.current.error).toBe(errorMsg);
    });

    it('should refresh documents when refresh is called', async () => {
        const { result } = renderHook(() => useSourceDocuments());
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.docs.length).toBe(2);
        // Change mock return value
        const { fetchSourceDocuments } = await import('../../src/services/sourceDocumentService');
        fetchSourceDocuments.mockResolvedValueOnce([
            { id: 3, name: 'Doc 3' }
        ]);
        await act(async () => {
            result.current.refresh();
            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });
        });
        expect(result.current.docs).toEqual([
            { id: 3, name: 'Doc 3' }
        ]);
    });
});
