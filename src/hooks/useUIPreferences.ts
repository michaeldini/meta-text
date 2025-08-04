// Hook to fetch and expose all user UI preferences for document display
// Returns all preferences with sensible defaults if not set

import { useUserConfig, useUpdateUserConfig } from '@services/userConfigService';

export function useUIPreferences() {
    const { data: userConfig } = useUserConfig();
    const updateUserConfig = useUpdateUserConfig();
    const uiPrefs = userConfig?.uiPreferences || {};
    return {
        textSizePx: uiPrefs.textSizePx ?? 28,
        fontFamily: uiPrefs.fontFamily ?? 'Inter, sans-serif',
        lineHeight: uiPrefs.lineHeight ?? 1.5,
        paddingX: uiPrefs.paddingX ?? 0.3,
        showChunkPositions: uiPrefs.showChunkPositions ?? false,
        updateUserConfig,
    };
}
