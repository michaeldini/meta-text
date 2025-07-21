// Service to hydrate Zustand stores with user config from backend
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/ky';

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


// TanStack Query: Fetch user config
export function useUserConfig() {
    return useQuery<UserConfig>({
        queryKey: ['user-config'],
        queryFn: async () => api.get('user/config').json<UserConfig>(),
        staleTime: 10 * 60 * 1000,
    });
}

// TanStack Query: Update user config
export function useUpdateUserConfig() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (config: Partial<UserConfig["uiPreferences"]>) => {
            const payload = { ...config };
            return api.post('user/config', { json: payload }).json<UserConfig>();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-config'] });
        },
    });
}

// Fetch user config from backend API
export async function fetchUserConfig(): Promise<UserConfig> {
    return api.get('user/config').json<UserConfig>();
}

// Set or update user config in backend
export async function setUserConfig(config: Partial<UserConfig["uiPreferences"]>): Promise<UserConfig> {
    // POST only the fields that are present in config
    const payload = { ...config };
    return api.post('user/config', { json: payload }).json<UserConfig>();
}
