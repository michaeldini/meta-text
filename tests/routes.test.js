import { describe, it, expect } from 'vitest';
import { metaTextDetailRoute, metaTextReviewRoute } from '../src/routes.js';

describe('routes.js', () => {
    it('metaTextDetailRoute returns correct path', () => {
        expect(metaTextDetailRoute(123)).toBe('/metaText/123');
    });
    it('metaTextReviewRoute returns correct path', () => {
        expect(metaTextReviewRoute(456)).toBe('/metaText/456/review');
    });
});
