// Zustand stores for managing application state
//
// Important Stores:
// - documentStore: Stores lists of available source documents and metaTexts. Manages adding and removing source documents and metaTexts.
// - sourceDocumentDetailStore: Stores the text and metadata of a specific source document. Manages fetching and updating source documents.
// - metaTextDetailStore: Stores the text and metadata of a specific metaText. Manages fetching and updating metaTexts.
// - chunkStore: Stores chunks and metadata. Manages fetching and updating chunks. Manages chunk operations like splitting and combining chunks, and adding summaries or notes.
//
// Other Stores:
// - uiPreferencesStore: Stores line height, font size, and other UI preferences for chunks.
// - authStore: Manages authentication state and user information.
// - notificationStore: Handles notifications and alerts within the application.

export { useDocumentsStore } from './documentsStore';
export { useSourceDocumentDetailStore } from './sourceDocumentDetailStore';
export { useMetaTextDetailStore } from './metaTextDetailStore';
export { useChunkStore } from './chunkStore';

export { FONT_FAMILIES } from './uiPreferences';
export { useUIPreferencesStore } from './uiPreferences';
export { useNotificationStore } from './notificationStore';

export { useNotifications } from './notificationStore';
export { useAuth } from './authStore';
export { useAuthStore } from './authStore';
