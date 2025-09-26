/**
 * User Configuration Service
 * Handles fetching and updating user-specific settings
 * such as UI preferences.
 * 
 * This is the single source of truth for user configuration. There is no other hook, state, or context for user config. Components should use this service to read and update user settings. This helps for consistency, reducing indirection and complexity. This is done by leveraging TanStack Query's caching and state management.
 * 
 * Uses TanStack Query for data fetching and caching.
 * 
 * Depends on `ky` for HTTP requests.
 * 
 * Example usage:
 * const { data: userConfig, isLoading } = useUserConfig();
 * const updateUserConfig = useUpdateUserConfig();
 * 
 * or use the helper function to merge defaults:
 * const preferences = getPreferences(userConfig);
 * 
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@utils/ky';
import { UserConfig } from '@mtypes/user'


export const DEFAULT_CONFIG: UserConfig = {
    uiPreferences: {
        textSizePx: 18,
        fontFamily: 'Inter, sans-serif',
        lineHeight: 2.0,
        paddingX: 0.25,
        showChunkPositions: false,
    }
};

/**
 * Merges user config with default settings.
 * Ensures all expected fields are present.
 * 
 * @param userConfig Partial user config object
 * @returns Complete user config with defaults applied
 */
export function getPreferences(userConfig?: UserConfig): UserConfig {
    return {
        ...DEFAULT_CONFIG,
        ...(userConfig ?? {}),
    };
}

/**
 * 
 * @param enabled Whether to enable the query. Defaults to true.
 * 
 * @returns 
 */
export function useUserConfig(enabled: boolean = true) {
    const { isPending, isError, data, error } = useQuery<UserConfig>({
        queryKey: ['user-config'],
        queryFn: async () => api.get('user/config').json<UserConfig>(),
        staleTime: 10 * 60 * 1000,
        enabled, // only fetch if user exists
    });
    if (isPending) {
        console.log('[UserConfigService] Loading user config...');
    }
    if (isError) {
        console.error('[UserConfigService] Error fetching user config:', error);
    }
    return { isLoading: isPending, isError, data: data ?? DEFAULT_CONFIG, error };

}

// TanStack Query: Update user config
export function useUpdateUserConfig() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (config: Partial<UserConfig["uiPreferences"]>) => {
            const payload = { ...config };
            console.log('[UserConfigService] Sending payload to /user/config:', payload);
            return api.post('user/config', { json: payload }).json<UserConfig>();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-config'] });
        },
    });
}