import { describe, it, expect, vi, afterEach, beforeAll, afterAll } from 'vitest';

// Test for logger.js

describe('logger utility', () => {
    let originalFetch;
    beforeAll(() => {
        originalFetch = globalThis.fetch;
        globalThis.fetch = vi.fn().mockResolvedValue({});
    });
    afterAll(() => {
        globalThis.fetch = originalFetch;
    });
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should call fetch with correct params in sendLogToBackend', async () => {
        // Dynamically import to get the actual sendLogToBackend function
        const mod = await import('../../src/utils/logger');
        const sendLogToBackend = mod.default.__proto__.constructor.prototype.sendLogToBackend || mod.default.sendLogToBackend;
        // fallback: call the function directly if exported
        const fn = sendLogToBackend || (await import('../../src/utils/logger')).sendLogToBackend;
        if (fn) {
            await fn('info', 'test message', { foo: 'bar' });
            expect(fetch).toHaveBeenCalledWith('/api/frontend-log', expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ level: 'info', message: 'test message', context: { foo: 'bar' } })
            }));
        } else {
            // If not exported, test log.info wrapper
            const logger = mod.default;
            logger.info('test message');
            expect(fetch).toHaveBeenCalledWith('/api/frontend-log', expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: expect.stringContaining('test message')
            }));
        }
    });

    it('should not throw if fetch fails in sendLogToBackend', async () => {
        fetch.mockRejectedValueOnce(new Error('fail'));
        const mod = await import('../../src/utils/logger');
        const logger = mod.default;
        expect(() => logger.error('should not throw')).not.toThrow();
    });

    it('should call loglevel methods and send logs to backend', async () => {
        const mod = await import('../../src/utils/logger');
        const logger = mod.default;
        logger.info('info message');
        logger.warn('warn message');
        logger.error('error message');
        expect(fetch).toHaveBeenCalledWith('/api/frontend-log', expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: expect.stringContaining('info message')
        }));
        expect(fetch).toHaveBeenCalledWith('/api/frontend-log', expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: expect.stringContaining('warn message')
        }));
        expect(fetch).toHaveBeenCalledWith('/api/frontend-log', expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: expect.stringContaining('error message')
        }));
    });
});
