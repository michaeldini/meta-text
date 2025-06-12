import { describe, it, expect, vi } from 'vitest';
import { handleApiResponse } from '../../src/utils/api';

function createMockResponse({ ok = true, jsonData = {}, throwsOnJson = false } = {}) {
    return {
        ok,
        json: throwsOnJson
            ? vi.fn().mockRejectedValue(new Error('fail'))
            : vi.fn().mockResolvedValue(jsonData),
    };
}

describe('handleApiResponse', () => {
    it('returns parsed JSON if response is ok', async () => {
        const res = createMockResponse({ ok: true, jsonData: { foo: 'bar' } });
        const result = await handleApiResponse(res);
        expect(result).toEqual({ foo: 'bar' });
    });

    it('returns true if response is ok but json throws', async () => {
        const res = createMockResponse({ ok: true, throwsOnJson: true });
        const result = await handleApiResponse(res);
        expect(result).toBe(true);
    });

    it('throws error with detail if response is not ok and json returns detail', async () => {
        const res = createMockResponse({ ok: false, jsonData: { detail: 'bad' } });
        await expect(handleApiResponse(res)).rejects.toThrow('bad');
    });

    it('throws error with error if response is not ok and json returns error', async () => {
        const res = createMockResponse({ ok: false, jsonData: { error: 'fail' } });
        await expect(handleApiResponse(res)).rejects.toThrow('fail');
    });

    it('throws error with default message if response is not ok and json throws', async () => {
        const res = createMockResponse({ ok: false, throwsOnJson: true });
        await expect(handleApiResponse(res, 'Default error')).rejects.toThrow('Default error');
    });
});
