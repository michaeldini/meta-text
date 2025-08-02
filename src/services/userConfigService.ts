// Service to hydrate Zustand stores with user config from backend
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/ky';
import { UserConfig } from '../types/ui-types'

// TanStack Query: Fetch user config
// Accepts user object, hydrates only when user is present/changes
export function useUserConfig(enabled: boolean = true) {
    return useQuery<UserConfig>({
        queryKey: ['user-config'],
        queryFn: async () => api.get('user/config').json<UserConfig>(),
        staleTime: 10 * 60 * 1000,
        enabled, // only fetch if user exists
    });
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