/**
 * Test Suite for Image Polling Utility
 * 
 * Tests the image availability polling functionality used by the useImageTool hook.
 * 
 * @author Meta Text Team
 * @since 2025-07-08
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pollImageAvailability } from './imagePolling';

// Mock Image constructor
const mockImage = {
    onload: null as any,
    onerror: null as any,
    src: '',
};

// Mock global Image
global.Image = vi.fn(() => mockImage) as any;

describe('pollImageAvailability', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        mockImage.onload = null;
        mockImage.onerror = null;
        mockImage.src = '';
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should resolve when image loads successfully', async () => {
        const url = 'https://example.com/image.jpg';

        const promise = pollImageAvailability(url);

        // Simulate successful image load
        setTimeout(() => {
            if (mockImage.onload) {
                mockImage.onload();
            }
        }, 100);

        vi.advanceTimersByTime(100);

        await expect(promise).resolves.toBeUndefined();
        expect(mockImage.src).toContain(url);
        expect(mockImage.src).toContain('cacheBust=');
    });

    it('should retry on error and eventually succeed', async () => {
        const url = 'https://example.com/image.jpg';

        const promise = pollImageAvailability(url, 5000, 100);

        // First attempt fails
        setTimeout(() => {
            if (mockImage.onerror) {
                mockImage.onerror();
            }
        }, 50);

        // Second attempt succeeds
        setTimeout(() => {
            if (mockImage.onload) {
                mockImage.onload();
            }
        }, 150);

        vi.advanceTimersByTime(50);
        vi.advanceTimersByTime(100); // Wait for retry
        vi.advanceTimersByTime(50);  // Trigger success

        await expect(promise).resolves.toBeUndefined();
    });

    it('should reject when timeout is reached', async () => {
        const url = 'https://example.com/image.jpg';
        const timeout = 1000;

        const promise = pollImageAvailability(url, timeout, 100);

        // Always fail
        const failImage = () => {
            if (mockImage.onerror) {
                mockImage.onerror();
            }
        };

        // Simulate multiple failures
        for (let i = 0; i < 20; i++) {
            setTimeout(failImage, i * 100 + 50);
        }

        vi.advanceTimersByTime(timeout + 100);

        await expect(promise).rejects.toThrow('Image loading timeout');
    });

    it('should use default timeout and interval values', async () => {
        const url = 'https://example.com/image.jpg';

        const promise = pollImageAvailability(url);

        // Should use default timeout of 10000ms
        setTimeout(() => {
            if (mockImage.onload) {
                mockImage.onload();
            }
        }, 100);

        vi.advanceTimersByTime(100);

        await expect(promise).resolves.toBeUndefined();
    });

    it('should add cache-busting parameter to URL', async () => {
        const url = 'https://example.com/image.jpg';

        const promise = pollImageAvailability(url);

        setTimeout(() => {
            if (mockImage.onload) {
                mockImage.onload();
            }
        }, 100);

        vi.advanceTimersByTime(100);

        await promise;

        expect(mockImage.src).toMatch(/https:\/\/example\.com\/image\.jpg\?cacheBust=\d+/);
    });

    it('should handle URLs with existing query parameters', async () => {
        const url = 'https://example.com/image.jpg?version=1';

        const promise = pollImageAvailability(url);

        setTimeout(() => {
            if (mockImage.onload) {
                mockImage.onload();
            }
        }, 100);

        vi.advanceTimersByTime(100);

        await promise;

        expect(mockImage.src).toMatch(/https:\/\/example\.com\/image\.jpg\?version=1&cacheBust=\d+/);
    });
});
