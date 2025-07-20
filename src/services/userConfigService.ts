// Service to hydrate Zustand stores with user config from backend
import { useUIPreferencesStore } from '../store/uiPreferences';
import { apiGet, apiPost } from '../utils/api';

// User config shape returned from backend
export interface UserConfig {
    uiPreferences?: {
        textSizePx?: number;
        fontFamily?: string;
        lineHeight?: number;
        paddingX?: number;
        showChunkPositions?: boolean;
    };
}

// Hydrate Zustand stores with user config
export function hydrateUserConfig(config: UserConfig) {
    if (config.uiPreferences) {
        useUIPreferencesStore.getState().hydrateUIPreferences(config.uiPreferences);
    }
}

// Fetch user config from backend API
export async function fetchUserConfig(): Promise<UserConfig> {
    return apiGet('/api/user/config');
}

// Set or update user config in backend
export async function setUserConfig(config: Partial<UserConfig["uiPreferences"]>): Promise<UserConfig> {
    // POST only the fields that are present in config
    const payload = { ...config };
    return apiPost('/api/user/config', payload);
}
