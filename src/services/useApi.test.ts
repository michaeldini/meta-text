import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApi } from './useApi';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useApi', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    it('should handle successful API call', async () => {
        const mockResponse = {
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: new Headers({ 'content-type': 'application/json' }),
            json: vi.fn().mockResolvedValue({ message: 'success' }),
        };

        mockFetch.mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useApi());

        act(() => {
            result.current.request({ url: '/test', method: 'GET' });
        });

        await waitFor(() => {
            expect(result.current.data).toEqual({ message: 'success' });
            expect(result.current.error).toBeNull();
            expect(result.current.loading).toBe(false);
        });
    });

    it('should handle API error', async () => {
        const mockResponse = {
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            headers: new Headers(),
        };

        mockFetch.mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useApi());

        act(() => {
            result.current.request({ url: '/fail', method: 'GET' });
        });

        await waitFor(() => {
            expect(result.current.data).toBeNull();
            expect(result.current.error).toContain('HTTP error! status: 500');
            expect(result.current.loading).toBe(false);
        });
    });
});
