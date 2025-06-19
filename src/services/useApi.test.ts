import { renderHook, act, waitFor } from '@testing-library/react';
import axios from 'axios';
import { describe, it, expect, vi } from 'vitest';
import { useApi } from './useApi';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useApi', () => {
    it('should handle successful API call', async () => {
        (mockedAxios as any).mockResolvedValueOnce({ data: { message: 'success' } });
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
        (mockedAxios as any).mockRejectedValueOnce({ message: 'fail', response: { data: { detail: 'fail' } } });
        const { result } = renderHook(() => useApi());

        act(() => {
            result.current.request({ url: '/fail', method: 'GET' });
        });

        await waitFor(() => {
            expect(result.current.data).toBeNull();
            expect(result.current.error).toBe('fail');
            expect(result.current.loading).toBe(false);
        });
    });
});
