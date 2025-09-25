// Service to hydrate Zustand stores with user config from backend
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/ky';
import { UserConfig } from '../types/user'


export const DEFAULT_CONFIG: UserConfig = {
    uiPreferences: {
        textSizePx: 18,
        fontFamily: 'Inter, sans-serif',
        lineHeight: 2.0,
        paddingX: 0.25,
        showChunkPositions: false,
    }
};

export function getPreferences(userConfig?: UserConfig): UserConfig {
    return {
        ...DEFAULT_CONFIG,
        ...(userConfig ?? {}),
    };
}

// TanStack Query: Fetch user config
// Accepts user object, hydrates only when user is present/changes
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