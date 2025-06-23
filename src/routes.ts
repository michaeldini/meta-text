// src/routes.ts
// Centralized route helpers for MetaText-related pages
export const metaTextDetailRoute = (metaTextId: string) => `/metaText/${metaTextId}`;
export const metaTextReviewRoute = (metaTextId: string) => `/metaText/${metaTextId}/review`;
export const experimentsRoute = () => '/experiments';
