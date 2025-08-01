
import { useEffect } from 'react';
import { useUserConfig } from '@services/userConfigService';


// This hook is now a no-op, as hydration is handled by TanStack Query's cache and useUserConfig
export function useHydrateUserConfig(onLoaded?: () => void) {
    const { isSuccess } = useUserConfig();
    useEffect(() => {
        if (isSuccess && onLoaded) onLoaded();
    }, [isSuccess, onLoaded]);
}
