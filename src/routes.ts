// src/routes.ts
// Centralized route helpers for MetaText-related pages
export const metaTextDetailRoute = (metaTextId: string | number) => `/metaText/${metaTextId}`;
export const metaTextReviewRoute = (metaTextId: string | number) => `/metaText/${metaTextId}/review`;
