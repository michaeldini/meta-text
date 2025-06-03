import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useSourceDocuments } from '../../src/hooks/useSourceDocuments';

// Mock the service function
vi.mock('../../src/services/sourceDocumentService', () => ({
    fetchSourceDocuments: vi.fn().mockResolvedValue([
        { id: 1, name: 'Doc 1' },
        { id: 2, name: 'Doc 2' },
    ]),
}));

describe('useSourceDocuments', () => {
    it('fetches and returns documents', async () => {
        const { result } = renderHook(() => useSourceDocuments());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.docs).toEqual([
            { id: 1, name: 'Doc 1' },
            { id: 2, name: 'Doc 2' },
        ]);
        expect(result.current.error).toBeNull();
    });
});
